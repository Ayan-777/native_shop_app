import mongoose from "mongoose";
import {ENV} from "./env.js";


export const connectDB = async () => {
    try {
        const connectDatabase = await mongoose.connect(ENV.DB_URL);
        console.log(`➜ MongoDB Connect successfully ✅ ${connectDatabase.connection.host}`)
    } catch (error) {
        console.log(`MONGODB connection error ${error}`);
        process.exit(1);
    }
}
