import express from "express";
import cookieParser from "cookie-parser";
import propertyRoutes  from "./routes/propertyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import { dbConnector } from "./config/db.config.js";
import cors from "cors";


import { initCloudinary } from "./config/cloudinary.js";

initCloudinary();

const app = express();

app.use(cors(
    {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}
));

app.use(express.json());
app.use(cookieParser());


//database connection
dbConnector();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);
 



app.listen(process.env.PORT, () => {
    console.log(`The app is listennig on port ${process.env.PORT}`);
})