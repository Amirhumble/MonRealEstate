import express from "express";
import { getAllProperties, getFeaturedProperties, addProperty, updateProperty, deleteProperty} from "../controllers/propertyController.js";
import upload from "../middleware/upload.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllProperties);
router.get("/featured", getFeaturedProperties);
router.post("/", authenticate, authorizeRole("admin"), upload.single("image"), addProperty);
router.put("/:id", authenticate, authorizeRole("admin"), upload.single("image"), updateProperty);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteProperty); 

export default router;