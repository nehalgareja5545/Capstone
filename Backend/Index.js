import express from "express";
import dotenv from "dotenv";
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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
