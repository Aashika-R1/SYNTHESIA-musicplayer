import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized" });
    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed: ", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
