import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnector = () => {
    mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}`)
  .then(() => console.log('Connected!'));
}