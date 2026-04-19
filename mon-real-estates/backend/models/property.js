import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    type: String,
    image: String,
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Property = mongoose.model("Property", PropertySchema)