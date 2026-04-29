// import { Property } from "../models/property.js";
// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";

// // Helper: upload buffer to Cloudinary
// const uploadToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "properties" }, // optional folder name in Cloudinary
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result.secure_url); // return the hosted image URL
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

// // Get all properties
// export const getAllProperties = async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get featured properties
// export const getFeaturedProperties = async (req, res) => {
//   try {
//     const featured = await Property.find({ featured: true });
//     res.json(featured);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Add new property
// export const addProperty = async (req, res) => {
//   try {
//     let imageUrl = "";
//     if (req.file) {
//       // Upload image to Cloudinary if provided
//       imageUrl = await uploadToCloudinary(req.file.buffer);
//     }

//     const property = new Property({
//       ...req.body,
//       image: imageUrl
//     });

//     await property.save();
//     res.status(201).json(property);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update property
// export const updateProperty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let updatedData = { ...req.body };

//     if (req.file) {
//       // Upload new image if provided
//       updatedData.image = await uploadToCloudinary(req.file.buffer);
//     }

//     const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
//     if (!updatedProperty) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     res.json(updatedProperty);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete property
// export const deleteProperty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedProperty = await Property.findByIdAndDelete(id);
//     if (!deletedProperty) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     res.json({ message: "Property deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };






//using disk storage

import { Property } from "../models/property.js";
import cloudinary from "../config/cloudinary.js";

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const featured = await Property.find({ featured: true });
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new property
export const addProperty = async (req, res) => {
  try {
    console.log("=== ADD PROPERTY DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files ? Object.keys(req.files) : "No files");
    
    let imageUrl = "";
    let imageUrls = [];
    
    if (req.files) {
      // Upload main image
      if (req.files.image && req.files.image[0]) {
        const result = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: "properties"
        });
        imageUrl = result.secure_url;
        console.log("Main image uploaded:", imageUrl);
      }
      
      // Upload additional images
      if (req.files.images) {
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "properties"
          });
          imageUrls.push(result.secure_url);
        }
        console.log("Gallery images uploaded:", imageUrls.length);
      }
      
      // Upload floor plans
      if (req.files.floorPlans) {
        const floorPlanUrls = [];
        for (const file of req.files.floorPlans) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "properties/floorplans"
          });
          floorPlanUrls.push(result.secure_url);
        }
        req.body.floorPlans = floorPlanUrls;
        console.log("Floor plans uploaded:", floorPlanUrls.length);
      }
      
      // Upload agent photo
      if (req.files.agentPhoto && req.files.agentPhoto[0]) {
        const result = await cloudinary.uploader.upload(req.files.agentPhoto[0].path, {
          folder: "agents"
        });
        req.body.agentPhoto = result.secure_url;
        console.log("Agent photo uploaded:", req.body.agentPhoto);
      }
    } else if (req.file) {
      // Single file upload (backward compatibility)
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "properties"
      });
      imageUrl = result.secure_url;
    }

    // Parse arrays if they come as strings
    if (typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        req.body.features = req.body.features.split(',').map(f => f.trim()).filter(f => f);
      }
    }
    if (typeof req.body.amenities === 'string') {
      try {
        req.body.amenities = JSON.parse(req.body.amenities);
      } catch (e) {
        req.body.amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    // Convert numeric fields from strings to numbers
    const propertyData = { ...req.body };
    
    // Convert price to number (required field)
    if (propertyData.price) {
      propertyData.price = Number(propertyData.price);
    }
    
    // Convert optional numeric fields
    if (propertyData.bedrooms && propertyData.bedrooms !== '') {
      propertyData.bedrooms = Number(propertyData.bedrooms);
    } else {
      delete propertyData.bedrooms;
    }
    
    if (propertyData.bathrooms && propertyData.bathrooms !== '') {
      propertyData.bathrooms = Number(propertyData.bathrooms);
    } else {
      delete propertyData.bathrooms;
    }
    
    if (propertyData.area && propertyData.area !== '') {
      propertyData.area = Number(propertyData.area);
    } else {
      delete propertyData.area;
    }
    
    if (propertyData.yearBuilt && propertyData.yearBuilt !== '') {
      propertyData.yearBuilt = Number(propertyData.yearBuilt);
    } else {
      delete propertyData.yearBuilt;
    }
    
    if (propertyData.parking && propertyData.parking !== '') {
      propertyData.parking = Number(propertyData.parking);
    } else {
      delete propertyData.parking;
    }
    
    if (propertyData.floors && propertyData.floors !== '') {
      propertyData.floors = Number(propertyData.floors);
    } else {
      delete propertyData.floors;
    }

    // Convert boolean fields
    if (propertyData.featured) {
      propertyData.featured = propertyData.featured === 'true' || propertyData.featured === true;
    }

    // Remove empty string fields
    Object.keys(propertyData).forEach(key => {
      if (propertyData[key] === '' || propertyData[key] === null || propertyData[key] === undefined) {
        delete propertyData[key];
      }
    });

    console.log("Processed property data:", propertyData);

    const property = new Property({
      ...propertyData,
      image: imageUrl,
      images: imageUrls
    });

    console.log("Creating property with data:", property);
    await property.save();
    console.log("Property saved successfully:", property._id);
    
    res.status(201).json(property);
  } catch (error) {
    console.error("Error adding property:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    console.log("=== UPDATE PROPERTY DEBUG ===");
    console.log("Property ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files ? Object.keys(req.files) : "No files");
    
    const { id } = req.params;
    let updatedData = { ...req.body };

    if (req.files) {
      // Update main image if provided
      if (req.files.image && req.files.image[0]) {
        const result = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: "properties"
        });
        updatedData.image = result.secure_url;
        console.log("Main image updated:", updatedData.image);
      }
      
      // Update additional images if provided
      if (req.files.images) {
        const imageUrls = [];
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "properties"
          });
          imageUrls.push(result.secure_url);
        }
        updatedData.images = imageUrls;
        console.log("Gallery images updated:", imageUrls.length);
      }
      
      // Update floor plans if provided
      if (req.files.floorPlans) {
        const floorPlanUrls = [];
        for (const file of req.files.floorPlans) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "properties/floorplans"
          });
          floorPlanUrls.push(result.secure_url);
        }
        updatedData.floorPlans = floorPlanUrls;
        console.log("Floor plans updated:", floorPlanUrls.length);
      }
      
      // Update agent photo if provided
      if (req.files.agentPhoto && req.files.agentPhoto[0]) {
        const result = await cloudinary.uploader.upload(req.files.agentPhoto[0].path, {
          folder: "agents"
        });
        updatedData.agentPhoto = result.secure_url;
        console.log("Agent photo updated:", updatedData.agentPhoto);
      }
    } else if (req.file) {
      // Single file upload (backward compatibility)
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "properties"
      });
      updatedData.image = result.secure_url;
    }

    // Parse arrays if they come as strings
    if (typeof updatedData.features === 'string') {
      try {
        updatedData.features = JSON.parse(updatedData.features);
      } catch (e) {
        updatedData.features = updatedData.features.split(',').map(f => f.trim()).filter(f => f);
      }
    }
    if (typeof updatedData.amenities === 'string') {
      try {
        updatedData.amenities = JSON.parse(updatedData.amenities);
      } catch (e) {
        updatedData.amenities = updatedData.amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    // Convert numeric fields from strings to numbers
    if (updatedData.price) {
      updatedData.price = Number(updatedData.price);
    }
    
    if (updatedData.bedrooms && updatedData.bedrooms !== '') {
      updatedData.bedrooms = Number(updatedData.bedrooms);
    } else if (updatedData.bedrooms === '') {
      updatedData.bedrooms = undefined;
    }
    
    if (updatedData.bathrooms && updatedData.bathrooms !== '') {
      updatedData.bathrooms = Number(updatedData.bathrooms);
    } else if (updatedData.bathrooms === '') {
      updatedData.bathrooms = undefined;
    }
    
    if (updatedData.area && updatedData.area !== '') {
      updatedData.area = Number(updatedData.area);
    } else if (updatedData.area === '') {
      updatedData.area = undefined;
    }
    
    if (updatedData.yearBuilt && updatedData.yearBuilt !== '') {
      updatedData.yearBuilt = Number(updatedData.yearBuilt);
    } else if (updatedData.yearBuilt === '') {
      updatedData.yearBuilt = undefined;
    }
    
    if (updatedData.parking && updatedData.parking !== '') {
      updatedData.parking = Number(updatedData.parking);
    } else if (updatedData.parking === '') {
      updatedData.parking = undefined;
    }
    
    if (updatedData.floors && updatedData.floors !== '') {
      updatedData.floors = Number(updatedData.floors);
    } else if (updatedData.floors === '') {
      updatedData.floors = undefined;
    }

    // Convert boolean fields
    if (updatedData.featured) {
      updatedData.featured = updatedData.featured === 'true' || updatedData.featured === true;
    }

    // Remove empty string fields
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === '' || updatedData[key] === null) {
        delete updatedData[key];
      }
    });

    console.log("Processed update data:", updatedData);

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    console.log("Property updated successfully:", updatedProperty._id);
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
