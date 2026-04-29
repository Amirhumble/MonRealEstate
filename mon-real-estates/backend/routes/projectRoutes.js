import express from "express";
import { 
  getAllProjects, 
  getProjectById,
  getFeaturedProjects, 
  getProjectsByStatus,
  addProject, 
  updateProject, 
  deleteProject
} from "../controllers/projectController.js";
import upload from "../middleware/upload.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/featured", getFeaturedProjects);
router.get("/status/:status", getProjectsByStatus);
router.get("/:id", getProjectById);
router.post("/", authenticate, authorizeRole("admin"), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), addProject);
router.put("/:id", authenticate, authorizeRole("admin"), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), updateProject);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteProject);

export default router;
