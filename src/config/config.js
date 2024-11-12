import dotenv from "dotenv";

dotenv.config(
    {
        override:true
    }
);

export const config ={
    PORT:process.env.PORT, 
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME, 
    SECRET:process.env.SECRET, 
    SECRET_SESSION:process.env.SECRET_SESSION,
    JWT_SECRET:process.env.JWT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET
}