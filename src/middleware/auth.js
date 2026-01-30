import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookie.jwt;

    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);

    if (!isTokenValid) {
      return res.status(401).json({ message: "Unautharised Request" });
    }
  } catch (error) {
    console.log("error in protectRoute", error);
  }

  next();
};
