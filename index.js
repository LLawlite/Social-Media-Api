const dotenv=require("dotenv");
dotenv.config();
const express =require("express");
const mongoose=require("mongoose");
const morgan =require("morgan");
const helmet =require("helmet");
const res = require("express/lib/response");
const userRoute=require("./routes/user");
const authRoute=require("./routes/auth");
const postsRoute=require("./routes/posts");
const app=express();

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("Connected to database successfully");
})
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postsRoute);



app.listen(3000,()=>{
    console.log("Server started successfully")
})