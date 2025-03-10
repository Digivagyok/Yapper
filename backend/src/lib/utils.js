import jwt from "jsonwebtoken";

export const generateToken = (userId, response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });

    response.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // milisec
        httpOnly: true, // XSS
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // false in dev mode, othervise true
    });

    return token;
}