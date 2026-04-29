import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    
    // Images
    image: { type: String, required: true }, // Main image
    images: [{ type: String }], // Gallery images
    
    // Basic Info
    description: { type: String },
    status: { 
        type: String, 
        enum: ["For Sale", "For Rent", "Sold", "Pending"],
        default: "For Sale"
    },
    
    // Property Details
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number }, // Square footage
    lotSize: { type: String },
    yearBuilt: { type: Number },
    parking: { type: Number },
    floors: { type: Number },
    
    // Features & Amenities
    features: [{ type: String }],
    amenities: [{ type: String }],
    
    // Location Details
    address: { type: String },
    city: { type: String },
    neighborhood: { type: String },
    zipCode: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    
    // Additional Info
    floorPlans: [{ type: String }], // URLs to floor plan images
    virtualTour: { type: String }, // URL to virtual tour
    videoUrl: { type: String },
    
    // Agent Info
    agentName: { type: String },
    agentEmail: { type: String },
    agentPhone: { type: String },
    agentPhoto: { type: String },
    
    // System
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
PropertySchema.pre('save', function() {
    this.updatedAt = Date.now();
});

export const Property = mongoose.model("Property", PropertySchema)