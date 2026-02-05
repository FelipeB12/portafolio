import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Lazy configuration function to prevent top-level crashes
function configureCloudinary() {
    try {
        let url = process.env.CLOUDINARY_URL;

        // Handle common copy-paste error: "CLOUDINARY_URL=CLOUDINARY_URL=..."
        if (url && url.startsWith("CLOUDINARY_URL=")) {
            url = url.replace("CLOUDINARY_URL=", "");
        }

        if (url) {
            if (!url.startsWith("cloudinary://")) {
                throw new Error("Invalid CLOUDINARY_URL protocol. Must start with 'cloudinary://'");
            }
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
            });
        }
    } catch (error: any) {
        console.error("❌ Cloudinary Config Error:", error.message);
    }
}

/**
 * Upload a file to Cloudinary or local storage (fallback)
 */
export async function uploadFile(
    file: File,
    folder: string = "portfolio"
): Promise<{ url: string; publicId: string }> {
    // Check if Cloudinary is configured
    const isCloudinaryConfigured = !!(
        process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET)
    );

    // If in development and Cloudinary is NOT configured, use local storage
    if (!isCloudinaryConfigured && process.env.NODE_ENV === "development") {
        console.warn("⚠️ Cloudinary not configured. Falling back to local storage.");
        return uploadLocal(file);
    }

    // Ensure Cloudinary is configured before attempting upload
    configureCloudinary();

    // Production or if Cloudinary is configured: Upload to Cloudinary
    return uploadToCloudinary(file, folder);
}

/**
 * Upload file to Cloudinary
 */
async function uploadToCloudinary(
    file: File,
    folder: string
): Promise<{ url: string; publicId: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        // Double check configuration before calling SDK
        const config = cloudinary.config();
        if (!config.cloud_name && !process.env.CLOUDINARY_URL) {
            return reject(new Error("Cloudinary is not correctly configured. Please check your CLOUDINARY_URL format. It should start with 'cloudinary://'"));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto", // Handles images, PDFs, etc.
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed"));
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Upload file to local storage (Development only)
 */
async function uploadLocal(file: File): Promise<{ url: string; publicId: string }> {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    try {
        await fs.access(uploadsDir);
    } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${uuidv4()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return {
        url: `/uploads/${fileName}`,
        publicId: fileName,
    };
}
