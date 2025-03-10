import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (request, response) => {
    const {fullName, email, password} = request.body;

    try {
        if (!fullName || !email || !password){
            return response.status(400).json({message: "Minden mező kitöltése közelező!"});
        }

        if  (password.length < 6){
            return response.status(400).json({message: "A jelszónak legalább 6 karakter hosszúnak kell lennie"});
        }

        const user = await User.findOne({email});
        
        if (user) {
            return response.status(400).json({message: "Ez az email már létezik"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        });

        if  (newUser){
            generateToken(newUser._id, response);
            await newUser.save();

            response.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            response.status(400).json({message: "Nem megfelelő felhasználói adatok"});
        }
    } catch (error) {
        console.log("Hiba a signup controller-ben: ", error.message);
        response.status(500).json({message: "Internal Server Error" });
    }
};

export const login = async (request, response) => {
    const {email, password} = request.body;

    try {
        const user = await User.findOne({email});

        if (!user){
            return response.status(400).json({message: "Nem megfelelő jelszó vagy email"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if  (!isPasswordCorrect){
            return response.status(400).json({message: "Nem megfelelő jelszó vagy email"});
        }

        generateToken(user._id, response);

        response.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Hiba a login controllerben: ", error.message);
        response.status(500).json({message: "Internal Server Error" });
    }
};

export const logout = async (request, response) => {
    try{
        response.cookie("jwt", "", {maxAge: 0});
        response.status(200).json({message: "Sikeres kijelentkezés"});
    } catch (error) {
        console.log("Hiba a logout controllerben: ", error.message);
        response.status(500).json({message: "Internal Server Error" });
    }
};

export const updateProfile = async (request, response) => {
    try {
        const {profilePic} = request.body;
        const userId = request.user._id;

        if (!profilePic){
            return response.status(400).json({message: "A profil kép kötelező"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        );

        response.status(200).json(updateUser);

    } catch (error) {
        console.log("Hiba a profil frissítésében: ", error);
        response.status(500).json({message: "Internal server error"});
    }
};

export const checkAuth = async (request, response) => {
    try {
        response.status(200).json(request.user);
    } catch (error) {
        console.log("Hiba a checkAuth controllerben", error);
        response.status(500).json({message: "Internal server error"});
    }
};