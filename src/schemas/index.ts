import { z } from "zod";

// User schemas
export const userSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
});

// Project schemas
export const projectSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
        .toLowerCase()
        .trim(),
    shortDescription: z
        .string()
        .min(1, "Short description is required")
        .max(300, "Short description cannot exceed 300 characters"),
    problem: z.string().min(1, "Problem statement is required"),
    solution: z.string().min(1, "Solution description is required"),
    role: z.string().min(1, "Role is required"),
    techStack: z.array(z.string()).default([]),
    keyDecisions: z.array(z.string()).default([]),
    screenshots: z
        .array(
            z.object({
                url: z.string().url("Invalid screenshot URL"),
                alt: z.string().optional(),
            })
        )
        .default([]),
    liveLink: z.string().url("Invalid live link URL").optional().or(z.literal("")),
    githubLink: z
        .string()
        .url("Invalid GitHub link URL")
        .optional()
        .or(z.literal("")),
    featured: z.boolean().default(false),
});

export const projectUpdateSchema = projectSchema.partial();

// Blog post schemas
export const blogPostSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
        .toLowerCase()
        .trim(),
    excerpt: z
        .string()
        .min(1, "Excerpt is required")
        .max(500, "Excerpt cannot exceed 500 characters"),
    contentMarkdown: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().url("Invalid cover image URL").optional().or(z.literal("")),
    publishedAt: z.coerce.date().optional(),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

// Contact message schemas
export const contactMessageSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    message: z
        .string()
        .min(1, "Message is required")
        .max(5000, "Message cannot exceed 5000 characters"),
    projectBudget: z.string().optional(),
    file: z
        .object({
            url: z.string().url(),
            name: z.string(),
        })
        .optional(),
    // Honeypot field - should be empty
    website: z.string().max(0).optional(),
});

// CV schemas
export const cvSchema = z.object({
    fileUrl: z.string().url("Invalid file URL"),
    fileName: z.string().min(1, "File name is required"),
    uploadedBy: z.string().min(1, "Uploader ID is required"),
});

// Query parameter schemas
export const projectQuerySchema = z.object({
    featured: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    limit: z.coerce.number().positive().max(100).optional().default(20),
    skip: z.coerce.number().nonnegative().optional().default(0),
});

export const blogQuerySchema = z.object({
    tag: z.string().optional(),
    published: z
        .string()
        .optional()
        .transform((val) => val !== "false"),
    limit: z.coerce.number().positive().max(100).optional().default(20),
    skip: z.coerce.number().nonnegative().optional().default(0),
});

// Export types
export type UserInput = z.infer<typeof userSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type CVInput = z.infer<typeof cvSchema>;
