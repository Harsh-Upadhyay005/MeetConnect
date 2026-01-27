import httpStatus from "http-status";
import {User} from "../Models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Helper function to get userId from token
const getUserIdFromToken = async (token) => {
    if (!token) {
        return null;
    }
    try {
        const user = await User.findOne({ token });
        return user ? user._id : null;
    } catch (error) {
        console.error('Error finding user by token:', error);
        return null;
    }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status (httpStatus.BAD_REQUEST).json({message: "Email and Password are required."});
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found."});
        }
        if(bcrypt.compareSync(password, user.password)) {
            let token = crypto.randomBytes(64).toString('hex');
            user.token = token;
        await user.save();
        res.status(httpStatus.OK).json({message: "Login successful.", token: token});
        }
        else {
            return  res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid password."});
        }

    } catch (error) {
         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Login failed.", error: error.message});
    }
};
    

const registerUser = async (req, res) => {
    const {name, username, email, password} = req.body;

    try {
        // Validate required fields
        if (!name || !username || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "All fields are required (name, username, email, password)."
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Please provide a valid email address."
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Password must be at least 6 characters long."
            });
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(httpStatus.CONFLICT).json({
                    message: "An account with this email already exists."
                });
            } else {
                return res.status(httpStatus.CONFLICT).json({
                    message: "This username is already taken."
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, 
            username, 
            email, 
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({
            message: "Account created successfully! You can now sign in.",
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Registration failed. Please try again later.",
            error: error.message
        });
    }
};

const getToActivity = async (req, res) => {
    const {token} = req.query;
    
    if (!token) {
        return res.status(httpStatus.BAD_REQUEST).json({message: "Token is required."});
    }
    
    try {
        const userId = await getUserIdFromToken(token);
        if (!userId) {
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid token."});
        }
        
        const user = await User.findById(userId).select('activities name username');
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found."});
        }
        
        res.status(httpStatus.OK).json({
            message: "Activities retrieved successfully.",
            user: {
                name: user.name,
                username: user.username,
                activities: user.activities || []
            }
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Failed to retrieve activities.", error: error.message});
    }
};


const addToActivity = async (req, res) => {
    const {token, meeting_code} = req.body;
    
    if (!token || !meeting_code) {
        return res.status(httpStatus.BAD_REQUEST).json({message: "Token and meeting code are required."});
    }
    
    try {
        const userId = await getUserIdFromToken(token);
        if (!userId) {
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid token."});
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found."});
        }
        
        // Initialize activities array if it doesn't exist
        if (!user.activities) {
            user.activities = [];
        }
        
        user.activities.push({
            activity: meeting_code,
            timestamp: new Date()
        });
        
        await user.save();
        res.status(httpStatus.OK).json({message: "Activity added successfully.", activities: user.activities});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Failed to add activity.", error: error.message});
    }
};


export { loginUser, registerUser, addToActivity, getToActivity };