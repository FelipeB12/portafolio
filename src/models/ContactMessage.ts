import mongoose, { Schema, Document, Model } from "mongoose";

interface FileAttachment {
    url: string;
    name: string;
}

export interface IContactMessage extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    message: string;
    projectBudget?: string;
    file?: FileAttachment;
    createdAt: Date;
    processed: boolean;
}

const ContactMessageSchema = new Schema<IContactMessage>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            maxlength: [5000, "Message cannot exceed 5000 characters"],
        },
        projectBudget: {
            type: String,
            trim: true,
        },
        file: {
            url: String,
            name: String,
        },
        processed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ processed: 1 });

const ContactMessage: Model<IContactMessage> =
    mongoose.models.ContactMessage ||
    mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
