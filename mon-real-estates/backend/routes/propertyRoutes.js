import express from "express";
import { getAllProperties, getFeaturedProperties, addProperty, updateProperty, deleteProperty} from "../controllers/propertyController.js";
import upload from "../middleware/upload.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);
router.post("/", authenticate, authorizeRole("admin"), upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'floorPlans', maxCount: 5 },
  { name: 'agentPhoto', maxCount: 1 }
]), addProperty);
router.put("/:id", authenticate, authorizeRole("admin"), upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'floorPlans', maxCount: 5 },
  { name: 'agentPhoto', maxCount: 1 }
]), updateProperty);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteProperty); 

export default router;