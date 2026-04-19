import express from "express";
import propertyRoutes  from "./routes/propertyRoutes.js";
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

app.use(express.json())


//database connection
dbConnector();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/contacts", contactRoutes);
 



app.listen(process.env.PORT, () => {
    console.log(`The app is listennig on port ${process.env.PORT}`);
})