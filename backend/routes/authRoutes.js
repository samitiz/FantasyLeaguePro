import express from "express";
import { registerOrLogin } from "../controllers/authController.js";
const router = express.Router();

// Route to register or login
router.post("/register-or-login", registerOrLogin);

export default router;

