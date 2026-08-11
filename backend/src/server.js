import express from "express";
import path from "path";
import { clerkMiddleware, Client } from '@clerk/express'
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import serve from "inngest/express"
import { functions,inngest } from "./config/inngest.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(clerkMiddleware());

app.use("/api/inngest", serve({client : inngest, functions}));

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

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("http://localhost:8000")
    });
};

startServer();
