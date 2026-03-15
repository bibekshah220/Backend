import express from "express";
import { body, validationResult } from "express-validator";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "./auth.js";

const router = express.Router();

// validation middleware
const validateRegister = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required") 
        .isLength({ max: 25 }).withMessage("Name cannot be more than 25 characters"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please add a valid email"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please add a valid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);   
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            error: errors.array()[0].msg
        });
    }   
    next();
};

// post /api/auth/register
router.post("/register", validateRegister, handleValidationErrors, registerUser);

// post /api/auth/login
router.post("/login", validateLogin, handleValidationErrors, loginUser);

// get /api/auth/me 
router.get("/me", protect, getMe);

export default router;