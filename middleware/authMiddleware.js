import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticationToken = async  (req,res,next) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    if(!token) {
        res.status(401).json({
            succeded: false,
            error: "No token avaible."
        })
    }
    req.user = await User.findById(jwt.verify(token,process.env.JWT_SECRET).userId);
    next();
}


export {authenticationToken};