import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    bio: string;
    imageUrl?: string;
    skills: string[];
    updatedAt: Date;
    updatedBy: mongoose.Types.ObjectId;
}

const AboutSchema = new Schema<IAbout>({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    bio: {
        type: String,
        required: [true, "Bio is required"],
    },
    imageUrl: {
        type: String,
    },
    skills: {
        type: [String],
        default: [],
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Uploader reference is required"],
    },
});

// Since we only ever want one "About" record
const About: Model<IAbout> =
    mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
