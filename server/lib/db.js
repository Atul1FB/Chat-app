import mongoose from "mongoose"

// function to connect mongoDB Database

export const connectDb = async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("DataBase is connected"));

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error)
    }
}