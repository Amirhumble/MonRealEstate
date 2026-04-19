import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  savedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

export const User = mongoose.model("User", UserSchema);
