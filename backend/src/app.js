import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import multer from "multer"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const upload = multer();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json({limit:"16kb"}));   
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public")); 
app.use(cookieParser());
// Middleware to handle form-data (multipart)
app.use(upload.none()); 

//import routes
import userRouter from "./routes/user.route.js";
import accountRouter from "./routes/account.router.js";

app.use("/api/v1/user",userRouter);
app.use("/api/v1/account",accountRouter);

// Error handling middleware 
app.use(errorHandler);
export default app;