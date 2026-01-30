import { Router } from "express";
import { loginUser, registerUser } from "../controller/user.controller.js";

const router = Router();

router.post("/", registerUser);
router.post("/", loginUser);

export default router;
