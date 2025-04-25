const mongoose = require("mongoose");

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected",conn.connection.host)
    } catch (error) {
        console.log("not connected",error)
    }
}

module.exports = connectDB