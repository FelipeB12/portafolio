import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    contentMarkdown: string;
    tags: string[];
    coverImage?: string;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"],
        },
        excerpt: {
            type: String,
            required: [true, "Excerpt is required"],
            maxlength: [500, "Excerpt cannot exceed 500 characters"],
        },
        contentMarkdown: {
            type: String,
            required: [true, "Content is required"],
        },
        tags: {
            type: [String],
            default: [],
        },
        coverImage: {
            type: String,
            trim: true,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });

// Virtual for published status
BlogPostSchema.virtual("isPublished").get(function () {
    return this.publishedAt != null && this.publishedAt <= new Date();
});

const BlogPost: Model<IBlogPost> =
    mongoose.models.BlogPost ||
    mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
