import { asyncHandler } from "../utils/aysncHandler.js"
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js"


const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      //save refresh  token in db

      user.refreshToken.push(refreshToken)
      await user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }

   }
   catch (error) {
      throw new apiError(500, "Something went wrong while generating Access and Refresh token")
   }
}

const signupUser = asyncHandler(async (req, res) => {
   console.log(req.body)
   const { username, firstName, lastName, password } = req.body

   //check if user already exits in database 
   const existedUser = await User.findOne({ username })
   if (existedUser) {
      throw new apiError(409, "User with email or name already exists")
   }

   //store user in database

   const user = await User.create({
      username,
      firstName,
      lastName,
      password
   })
   // check if user is stored successfully in db and remove password and refresh Token
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createdUser) {
      throw new apiError(500, "Something went wrong while registering a user")
   }

   //return response to frontend

   return res.status(201).json(
      new apiResponse(200, createdUser, "User registered successfully")
   )
}
)

const signInUser = asyncHandler(async (req, res) => {

   //get user details from frontend

   const { username, password } = req.body


   //check if user already exits in db

   const user = await User.findOne({ username })

   if (!user) {
      throw new apiError(404, "User doesn't exists")
   }

   //verify password

   const isPasswordCorrect = await user.isPasswordCorrect(password)

   if (!isPasswordCorrect) {
      throw new apiError(401, "Invalid user credentials")
   }

   //generate access token and refresh token for user

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

   //send tokens in cookies

   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   //setting options so that cookies can't be modified on frontend

   const options = {
      httpOnly: true,
      secure: true
   }

   //send response
   res.status(200).
      cookie("accessToken", accessToken, options).
      cookie("refreshToken", refreshToken, options).
      json(
         new apiResponse(
            200,
            {
               user: loggedInUser,
               accessToken,
               refreshToken
            },
            "User logged In successfully"
         )
      )
})

const signOutUser = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;
   if (!refreshToken) {
      throw new apiError(401, "No refresh token provided");
   }

   const user = await User.findById(req.user._id);
   if (!user.refreshToken.includes(refreshToken)) {
      throw new apiError(401, "Invalid refresh token");
   }

   await User.findByIdAndUpdate(
      req.user._id,
      {
         $pull: {
            refreshToken: refreshToken
         }
      },
      {
         new: true
      }
   )
   const options = {
      httpOnly: true,
      secure: true
   }

   res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
         new apiResponse(
            200,
            {},
            "User logged out successfully"
         )
      )

})

//Use RefreshAcessToken to get new access token and refresh token when acess token expires

const refreshAccessToken=asyncHandler(async(req,res)=>{
   try {
      const incomingRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken;
      if(!incomingRefreshToken){
          throw new apiError(401,"Unauthorized request")
      }
      const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
      const user=await User.findById(decodedToken._id);
      
      if(!user){
          throw new apiError(401,"Invalid refresh token")
      }
      // Handle multiple devices login and multiple refresh tokens
      const userRefreshTokens=user.refreshToken;
      if(!userRefreshTokens.includes(incomingRefreshToken)){
          throw new apiError(401,"Invalid refresh token")
      }
      const {newAccessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id);
      const options={
          httpOnly:true,
          secure:true,
      }
      // Update user's refresh tokens to include the new one
      await User.findByIdAndUpdate(user._id, {
         $pull: { refreshToken: incomingRefreshToken },
         $addToSet: { refreshToken: newRefreshToken }
      });
      return res.status(200).
      cookie("accessToken",newAccessToken,options).
      cookie("refreshToken",newRefreshToken,options).
      json(new apiResponse(200,
          {
              accessToken:newAccessToken,
              refreshToken:newRefreshToken
   
          },
          "Access Token refreshed successfully"))
   } catch (error) {
      console.log("Refresh Token Expired error , jwt expired",error)
      throw new apiError(401, error?.message || "  Refresh Token Expired")
      
   }
})

export {
   signupUser,
   signInUser,
   signOutUser,
   refreshAccessToken,
}