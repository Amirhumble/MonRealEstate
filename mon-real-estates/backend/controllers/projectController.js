import { Project } from "../models/project.js";
import cloudinary from "../config/cloudinary.js";

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("relatedProperties");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("relatedProperties");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured projects
export const getFeaturedProjects = async (req, res) => {
  try {
    const featured = await Project.find({ featured: true }).populate("relatedProperties");
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get projects by status
export const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const projects = await Project.find({ status }).populate("relatedProperties");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new project
export const addProject = async (req, res) => {
  try {
    let coverImageUrl = "";
    let imageUrls = [];

    if (req.files) {
      // Upload cover image
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverResult = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
          folder: "projects"
        });
        coverImageUrl = coverResult.secure_url;
      }

      // Upload additional images
      if (req.files.images) {
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "projects"
          });
          imageUrls.push(result.secure_url);
        }
      }
    }

    const projectData = {
      ...req.body,
      coverImage: coverImageUrl,
      images: imageUrls
    };

    // Parse arrays if they come as strings
    if (typeof projectData.amenities === 'string') {
      projectData.amenities = JSON.parse(projectData.amenities);
    }
    if (typeof projectData.features === 'string') {
      projectData.features = JSON.parse(projectData.features);
    }
    if (typeof projectData.relatedProperties === 'string') {
      projectData.relatedProperties = JSON.parse(projectData.relatedProperties);
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = { ...req.body };

    if (req.files) {
      // Update cover image if provided
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverResult = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
          folder: "projects"
        });
        updatedData.coverImage = coverResult.secure_url;
      }

      // Update additional images if provided
      if (req.files.images) {
        const imageUrls = [];
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "projects"
          });
          imageUrls.push(result.secure_url);
        }
        updatedData.images = imageUrls;
      }
    }

    // Parse arrays if they come as strings
    if (typeof updatedData.amenities === 'string') {
      updatedData.amenities = JSON.parse(updatedData.amenities);
    }
    if (typeof updatedData.features === 'string') {
      updatedData.features = JSON.parse(updatedData.features);
    }
    if (typeof updatedData.relatedProperties === 'string') {
      updatedData.relatedProperties = JSON.parse(updatedData.relatedProperties);
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
