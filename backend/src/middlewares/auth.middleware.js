import jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/aysncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js"

export const verifyJwt =asyncHandler(async(req,_,next)=>{

    try {
        const token=req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","");   
        if(!token){
            throw new apiError(401,"Unauthorized request")
        } 
    
        //return the payload of the token if it is valid or throws an error if it is invalid
    
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(401,"Invalid Access Token")
        }   
        req.user=user;
        next()
    } catch (error) {
        console.log("Access Token Expired error , jwt expired",error)
        throw new apiError(401, error?.message || "Invalid access Token")
    }
})