import express from "express";
import { 
  login, 
  register, 
  profile, 
  createAdmin, 
  getAllAdmins, 
  updateAdmin, 
  deleteAdmin,
  updateProfile,
  toggleSavedProperty,
  getSavedProperties,
  refreshToken,
  logout,
  logoutAll
} from "../controllers/authController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Protected routes
router.get("/profile", authenticate, profile);
router.put("/update-profile", authenticate, upload.single("profilePicture"), updateProfile);
router.post("/toggle-saved/:propertyId", authenticate, toggleSavedProperty);
router.get("/saved-properties", authenticate, getSavedProperties);
router.post("/logout-all", authenticate, logoutAll);

// Admin routes
router.post("/create-admin", authenticate, authorizeRole("admin"), createAdmin);
router.get("/admins", authenticate, authorizeRole("admin"), getAllAdmins);
router.put("/admins/:id", authenticate, authorizeRole("admin"), updateAdmin);
router.delete("/admins/:id", authenticate, authorizeRole("admin"), deleteAdmin);

export default router;
