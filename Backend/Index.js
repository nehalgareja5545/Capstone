import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/AuthRoutes.js";
import connectDB from "./Config/database.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
