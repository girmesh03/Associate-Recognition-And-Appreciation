import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new CustomError("Authentication required.", 401));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new CustomError("TokenExpired", 403));
      }
      return next(new CustomError("Invalid access token.", 401));
    }

    req.user = decoded;
    next();
  });
};

export default protect;
