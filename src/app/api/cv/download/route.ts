import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import CV from "@/models/CV";
import { handleApiError } from "@/lib/auth";

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
        url_analytics: false, // Disable globally to prevent signature breakage
    });
} else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
        url_analytics: false,
    });
}

/**
 * GET /api/cv/download
 * Public endpoint to proxy the CV viewing/download
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get the most recent CV
        const cv = await CV.findOne()
            .sort({ uploadedAt: -1 })
            .lean();

        if (!cv || !cv.fileUrl) {
            return new NextResponse("CV not found", { status: 404 });
        }

        const isDownload = request.nextUrl.searchParams.get("download") === "true";

        // Metadata for signing
        const versionMatch = cv.fileUrl.match(/\/v(\d+)\//);
        const version = versionMatch ? versionMatch[1] : undefined;
        const extMatch = cv.fileUrl.match(/\.([a-zA-Z0-9]+)$/);
        const format = extMatch ? extMatch[1] : "pdf";

        // Try standard 'upload' type first
        let downloadUrl = cloudinary.url(cv.publicId, {
            resource_type: "image",
            type: "upload",
            sign_url: true,
            secure: true,
            version: version,
            format: format,
        });

        console.log(`Trying signed URL (upload): ${downloadUrl}`);
        let fileResponse = await fetch(downloadUrl);

        // FALLBACK 1: If 401, it might be an 'authenticated' asset
        if (fileResponse.status === 401 && cv.publicId) {
            console.log("Unauthorized on 'upload' type. Retrying with 'authenticated' type...");
            downloadUrl = cloudinary.url(cv.publicId, {
                resource_type: "image",
                type: "authenticated",
                sign_url: true,
                secure: true,
                version: version,
                format: format,
            });
            console.log(`Trying signed URL (authenticated): ${downloadUrl}`);
            fileResponse = await fetch(downloadUrl);
        }

        // FALLBACK 2: If 404, categorize as 'raw' (uncommon for PDF but possible if resource_type was wrong)
        if (fileResponse.status === 404 && cv.publicId) {
            console.log("Not found as 'image'. Retrying with 'raw' resource_type...");
            downloadUrl = cloudinary.url(cv.publicId, {
                resource_type: "raw",
                sign_url: true,
                secure: true,
                version: version,
            });
            fileResponse = await fetch(downloadUrl);
        }

        if (!fileResponse.ok) {
            console.error(`Fetch failed for URL: ${downloadUrl}`, {
                status: fileResponse.status,
                statusText: fileResponse.statusText
            });
            throw new Error(`Failed to fetch file from source: ${fileResponse.statusText} (${fileResponse.status})`);
        }

        // Get the binary content
        const buffer = await fileResponse.arrayBuffer();

        // Prepare headers
        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");

        // Use 'inline' to view in tab, 'attachment' to force download
        const disposition = isDownload ? "attachment" : "inline";
        headers.set("Content-Disposition", `${disposition}; filename="${cv.fileName || "CV.pdf"}"`);

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Download proxy error:", error);
        return handleApiError(error);
    }
}
