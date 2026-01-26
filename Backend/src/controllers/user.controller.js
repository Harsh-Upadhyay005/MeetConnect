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


export { loginUser, registerUser };