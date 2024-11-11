import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minLength: 3,
            maxLength: 20
        },
        firstName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minLength: 3,
            maxLength: 30
        },
        lastName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minLength: 3,
            maxLength: 30
        },
        password: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 10
        },
        refreshToken : {
            //Refresh Token should be of type [String] inorder to handle multiple devices
            type : [String],
        }

    },
    {
        timestamps: true
    }
)
// hashing password before saving it in a database  

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//Password Authentication

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//Generating Access Token

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
          _id: this._id,
          username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Generating Refresh Token

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
          _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)