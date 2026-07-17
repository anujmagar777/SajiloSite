import mongoose from "mongoose"

const connectDb = async()=>{
    try{
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing in environment variables")
        }
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch(error) {
            console.error("db error", error.message)
            throw error
    }
}

export default connectDb