import express from "express";
import { createContact, getAllContacts } from "../controllers/contactController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", authenticate, authorizeRole("admin"), getAllContacts);

export default router;