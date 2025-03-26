// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  let actualToken = token;
  if (token.startsWith("Bearer ")) {
    actualToken = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid." });
  }
};

export default authMiddleware;
