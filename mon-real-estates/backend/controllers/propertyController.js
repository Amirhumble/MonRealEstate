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
    let imageUrl = "";
    if (req.file) { 
     // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "properties"
      });
      imageUrl = result.secure_url;
    }

    const property = new Property({
      ...req.body,
      image: imageUrl
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "properties"
      });
      updatedData.image = result.secure_url;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(updatedProperty);
  } catch (error) {
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
