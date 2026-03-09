import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";

dotenv.config(".env");
const PORT = process.env.PORT || 5001;

const app = express();

//CONNECT  UR DATABASE
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running strong 💪" });
});
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
