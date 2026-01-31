import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookie.jwt;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unautharised Request" });
    }

    req.user = decodedToken;
  } catch (error) {
    console.log("error in protectRoute", error);
  }

  next();
};
