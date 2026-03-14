
import User from "../model/user.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: "User already exists with this email" });
        }  
        
        // Create new user
        const user = await User.create({ name, email, password });

        // Generate new token
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email                   
            },
            token,
            message: "User registered successfully"
        }); 
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }   
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }   
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }       
        // Generate token
        const token = generateToken(user._id);
        res.status(200).json({  
            success: true,  
            data: {
                _id: user._id,
                name: user.name,
                email: user.email   
            },  
            token,
            message: "User logged in successfully"
        }); 
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }           
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            message: "User fetched successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export default { registerUser, loginUser, getMe };     
