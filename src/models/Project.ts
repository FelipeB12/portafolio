import mongoose, { Schema, Document, Model } from "mongoose";

interface Screenshot {
    url: string;
    alt?: string;
}

export interface IProject extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    shortDescription: string;
    problem: string;
    solution: string;
    role: string;
    techStack: string[];
    keyDecisions: string[];
    screenshots: Screenshot[];
    liveLink?: string;
    githubLink?: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
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
        shortDescription: {
            type: String,
            required: [true, "Short description is required"],
            maxlength: [300, "Short description cannot exceed 300 characters"],
        },
        problem: {
            type: String,
            required: [true, "Problem statement is required"],
        },
        solution: {
            type: String,
            required: [true, "Solution description is required"],
        },
        role: {
            type: String,
            required: [true, "Role is required"],
        },
        techStack: {
            type: [String],
            default: [],
        },
        keyDecisions: {
            type: [String],
            default: [],
        },
        screenshots: [
            {
                url: {
                    type: String,
                    required: true,
                },
                alt: {
                    type: String,
                },
            },
        ],
        liveLink: {
            type: String,
            trim: true,
        },
        githubLink: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
