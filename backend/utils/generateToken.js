import jwt from "jsonwebtoken";

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
