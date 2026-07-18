import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const isAuth=async (req,res,next)=>{
    try{
        const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    const decoded =await jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded.id)
    next()
}catch (error){
    return res.status(500).json({error:`invalid token: ${error.message}`})
}
}

export default isAuth