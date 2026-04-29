import { User } from "../models/user.js";
import signToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profilePicture: user.profilePicture,
  savedProperties: user.savedProperties,
});

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password, currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    // If updating password, verify current password first
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to update password." });
      }
      
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }
      
      user.password = password; // Pre-save hook will hash it
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone; // Allow empty string to clear phone

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      user.profilePicture = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: safeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSavedProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.savedProperties.indexOf(propertyId);
    if (index === -1) {
      user.savedProperties.push(propertyId);
      await user.save();
      return res.status(200).json({ message: "Property saved successfully.", saved: true });
    } else {
      user.savedProperties.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Property removed from saved.", saved: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedProperties");
    res.status(200).json(user.savedProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (role && role !== "user") {
      return res.status(403).json({ message: "Cannot assign admin role during public registration." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const user = new User({
      name,
      email,
      password,
      role: "user",
    });

    await user.save();

    const token = signToken(user);
    res.status(201).json({ user: safeUser(user), token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const trimmedPassword = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`Login failed: User not found for email "${normalizedEmail}"`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log(`Debug: User found. Comparing password for ${normalizedEmail}. Input length: ${trimmedPassword.length}`);
    const isMatch = await user.comparePassword(trimmedPassword);
    
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for user ${normalizedEmail}. Input length: ${trimmedPassword.length}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    console.log(`Login successful for user ${normalizedEmail}`);
    res.status(200).json({ user: safeUser(user), token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const admin = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully.", user: safeUser(admin) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ user: safeUser(req.user) });
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const admin = await User.findByIdAndUpdate(
      id,
      { name, email: normalizedEmail },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({ message: "Admin updated successfully.", user: admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the current admin
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Cannot delete your own account." });
    }

    const admin = await User.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
