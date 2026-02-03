import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICV extends Document {
    _id: mongoose.Types.ObjectId;
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
}

const CVSchema = new Schema<ICV>({
    fileUrl: {
        type: String,
        required: [true, "File URL is required"],
    },
    fileName: {
        type: String,
        required: [true, "File name is required"],
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Uploader reference is required"],
    },
});

// Index
CVSchema.index({ uploadedAt: -1 });

const CV: Model<ICV> =
    mongoose.models.CV || mongoose.model<ICV>("CV", CVSchema);

export default CV;
