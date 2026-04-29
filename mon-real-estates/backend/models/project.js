import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Completed", "In Progress", "Upcoming"],
        required: true 
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    units: { type: Number },
    size: { type: String },
    amenities: [{ type: String }],
    features: [{ type: String }],
    timeline: { type: String },
    completionDate: { type: String },
    featured: { type: Boolean, default: false },
    relatedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model("Project", ProjectSchema);
