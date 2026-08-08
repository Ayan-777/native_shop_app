import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";
const app = express();


const __dirname = path.resolve();

app.use(clerkMiddleware());

app.get('/api/check',(req, res) => {
    res.status(200).json({message : "Success"})
})

// app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    });
}


app.listen(ENV.PORT, () => {
    
    console.log(`Server is running on ${"http://localhost:8000"} .....`);
    connectDB()
})