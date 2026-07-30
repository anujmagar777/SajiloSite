import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const googleAuth = async(req, res)=>{
    try{
        console.log("Google Auth Request Received:", req.body)
        const {name, email, avatar} = req.body
        if(!email){
            return res.status(400).json({
                message: "Email is Required!"
            })
        }
        let user = await User.findOne({email})
        if(!user){
            console.log("Creating new user with data:", {name, email, avatar})
            user = await User.create({name, email, avatar})
            console.log("New user created successfully:", user)
        } else {
            const updates = {}
            if (name && user.name !== name) {
                updates.name = name
            }
            if (avatar && user.avatar !== avatar) {
                updates.avatar = avatar
            }
            if (Object.keys(updates).length) {
                user.set(updates)
                await user.save()
            }
            console.log("User already exists:", user)
        }
        const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn: "7d"})

        const isProduction = process.env.NODE_ENV === 'production'

        res.cookie("token", token,{
            httpOnly:true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json({success: true, user, token})
    } catch(error){
        console.error("Google Auth Error:", error)
        return res.status(500).json({message: `Google Auth Error ${error.message}`})
    }
}

export const logOut = async(req,res)=>{
    try{
        const isProduction = process.env.NODE_ENV === 'production'
        res.clearCookie("token",{
            httpOnly:true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict"
        })
        return res.status(200).json({message: "Logged out successfully"})
    } catch(error){
         return res.status(500).json({message: `Log Out Error ${error}`})
    }
}
