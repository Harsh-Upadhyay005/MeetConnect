import httpStatus from "http-status";
import {User} from "../Models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({message: "User with this email or username already exists."});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, 
            username, 
            email, 
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({message: "User registered successfully."});
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Registration failed.", error: error.message});
    }
};

const getToActivity = async (req, res) => {
    const {userId} = req.query;
    
    if (!userId) {
        return res.status(httpStatus.BAD_REQUEST).json({message: "User ID is required."});
    }
    
    try {
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
    const {userId, activity} = req.body;
    
    if (!userId || !activity) {
        return res.status(httpStatus.BAD_REQUEST).json({message: "User ID and activity are required."});
    }
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found."});
        }
        
        // Initialize activities array if it doesn't exist
        if (!user.activities) {
            user.activities = [];
        }
        
        user.activities.push({
            activity,
            timestamp: new Date()
        });
        
        await user.save();
        res.status(httpStatus.OK).json({message: "Activity added successfully.", activities: user.activities});
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Failed to add activity.", error: error.message});
    }
};


export { loginUser, registerUser, addToActivity, getToActivity };