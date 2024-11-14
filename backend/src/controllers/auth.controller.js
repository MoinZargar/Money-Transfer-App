import { asyncHandler } from "../utils/aysncHandler.js"
import { User} from "../models/user.model.js";
import { Account } from "../models/account.model.js";
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
   const { username, firstName, lastName, password } = req.body
   username.trim()
   firstName.trim()
   lastName.trim()
   password.trim()
   
   //check if user already exits in database 
   const existedUser = await User.findOne({ username })
   if (existedUser) {
      throw new apiError(409, "username already exists")
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
   //Create Bank Account for user after successful registration
   await Account.create({
      user: user._id,
      balance: (1 + Math.random() * 10000).toFixed(2),
  })

    //generate access token and refresh token for user

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id)

    //send tokens in cookies
 
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
                user: createdUser,
                accessToken,
                refreshToken
             },
             "User registered successfully"
          )
       )
}
)

const signInUser = asyncHandler(async (req, res) => {

   //get user details from frontend

   const { username, password } = req.body
   username.trim()
   password.trim()

   //check if user already exits in db

   const user = await User.findOne({ username })

   if (!user) {
      throw new apiError(404, "User doesn't exists")
   }

   //verify password

   const isPasswordCorrect = await user.isPasswordCorrect(password)

   if (!isPasswordCorrect) {
      throw new apiError(401, "Invalid username or password. Please try again.")
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

const getCurrentUser = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id).select("-password -refreshToken")
   if (!user) {
      throw new apiError(404, "Current User not found")
   }
   return res.status(200).json(
      new apiResponse(
         200, 
         {user:user}, 
         "Current user details fetched successfully"
      )
   )
})

//Use RefreshAcessToken to get new access token and refresh token when acess token expires

const refreshAccessToken = asyncHandler(async (req, res) => {
   try {
      const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!incomingRefreshToken) {
         throw new apiError(401, "Unauthorized request")
      }
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id);

      if (!user) {
         throw new apiError(401, "Invalid refresh token")
      }
      // Handle multiple devices login and multiple refresh tokens
      const userRefreshTokens = user.refreshToken;
      if (!userRefreshTokens.includes(incomingRefreshToken)) {
         throw new apiError(401, "Invalid refresh token")
      }
      const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
      const options = {
         httpOnly: true,
         secure: true,
      }
      // Update user's refresh tokens to include the new one
      await User.findByIdAndUpdate(user._id, {
         $pull: { refreshToken: incomingRefreshToken },
         $addToSet: { refreshToken: newRefreshToken }
      });
      return res.status(200).
         cookie("accessToken", newAccessToken, options).
         cookie("refreshToken", newRefreshToken, options).
         json(new apiResponse(200,
            {
               accessToken: newAccessToken,
               refreshToken: newRefreshToken

            },
            "Access Token refreshed successfully"))
   } catch (error) {
      console.log("Refresh Token Expired error , jwt expired", error)
      throw new apiError(401, error?.message || "  Refresh Token Expired")

   }
})

const updateUserAccount = asyncHandler(async (req, res) => {
   const { firstName, lastName, password } = req.body
   const user = await User.findById(req.user._id)
   if (!user) {
      throw new apiError(404, "User not found")
   }
   user.firstName = firstName || user.firstName
   user.lastName = lastName || user.lastName
   user.password = password || user.password
   await user.save({ validateBeforeSave: false })
   const updatedUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
   )
   return res.status(200).json(
      new apiResponse(
         200, 
         {user: updatedUser}, 
         "User updated successfully"
      )
   )

})

const findUser = asyncHandler(async (req, res) => {
   let filter = (req.query.filter || "").trim().toLowerCase();
   if (filter === "") {
      throw new apiError(400, "Filter is required");
   }
   const users = await User.find({
      $or: [{
         firstName: {
            "$regex": filter
         }
      }, {
         lastName: {
            "$regex": filter
         }
      }]
   }).select("-password -refreshToken");
   if (users.length === 0) {
      throw new apiError(404, "No users found with the given name");
   }
   return res.status(200).json(
      new apiResponse(200, users, "Users found successfully")
   );
});

const findUserById = asyncHandler(async (req, res) => {
   const userId = req.params.id;
   const user = await User.findById(userId).select("-password -refreshToken");
   if (!user) {
      throw new apiError(404, "User not found");
   }
   return res.status(200).json(
      new apiResponse(200, user, "User found successfully")
   );
});

export {
   signupUser,
   signInUser,
   signOutUser,
   getCurrentUser,
   refreshAccessToken,
   updateUserAccount,
   findUser,
   findUserById,
}