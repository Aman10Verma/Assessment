const express = require("express");
const connectDB = require("./config/dbConfig")
const User = require("./model/user.model")
const cors = require("cors")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
dotenv.config()
const app = express();
connectDB()
app.use(cors())
//  This middleware parses incoming requests with JSON payloads an
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//get all user
app.get("/",async(req,res)=>{
    try {
        const users = await User.find()
    if(users){
        res.status(200).json({
            success:true,
            users,
        })
    }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
})
app.post("/user",async(req,res)=>{
    try {
        const {name,email,password}=req.body;

    if(!name || !email || !password){
        res.status(400).json({
            success:false,
            message:"All feilds are requierd",
        })
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400).json({
            success:false,
            message:"User already exists",
        })
    }
    hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name,
        email,
        password:hashedPassword,
    })
    if(user){
        res.status(201).json({
            success:true,
            user,
        })  
    }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})

//login user
app.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                success:false,
                message:"All feilds are requierd",
            })
        }
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({
                success:false,
                message:"User not found",
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(400).json({
                success:false,
                message:"Invalid credentials",
            })
        }
        res.status(200).json({
            success:true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})

//get user by id
app.get("/user/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id)

        if(user){
            res.status(200).json({
                success:true,
                user,
            })
        }else{
            res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})
//update user by id
app.put("/user/:id",async(req,res)=>{
    try {
        const {id} = req.params;
         //A library to help you hash passwords.
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const user = await User.findByIdAndUpdate(id,{
            email:req.body.email,
            name:req.body.name,
            password:hashedPassword,
        },{new:true})
        if(user){
            res.status(200).json({
                success:true,
                user,
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
)

//delete user by id
app.delete("/user/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id)
        if(user){
            res.status(200).json({
                success:true,
                message:"User deleted successfully",
            })
        }else{
            res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://locahost:${process.env.PORT}`)
})

module.exports = app