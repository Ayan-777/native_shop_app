import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { serve } from "inngest/express"
import { functions,inngest } from "./config/inngest.js";


import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(clerkMiddleware());

app.use("/api/inngest", serve({client: inngest, functions}));

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get('/api/check',(req, res) => {
    res.status(200).json({message : "Success"})
})

// app ready for deployment
if(ENV.NODE_ENV === "production"){
    const distPath =path.resolve(__dirname, "../../admin/dist");
    
    app.use(express.static(distPath))

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

const startServer = async () => {;

    const PORT = process.env.PORT || ENV.PORT || 8000;

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on port ${PORT}`)
    });

    try {
        await connectDB();
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
    }
};

startServer();
