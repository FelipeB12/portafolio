import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
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
    });
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
        return uploadLocal(file);
    }

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
