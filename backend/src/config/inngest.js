import {Inngest, inngest} from "inngest";
import {connectDB} from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({id: "shop-app"});

const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},

    async({event}) => {
        await connectDB();
        const {id, email_adresses, first_name, last_name, image_url} = event.data;

        const newUser = {
            clerkId: id,
            email: email_adresses?.[0] ?? null,
            name:`${first_name || ""} ${last_name || ""}`.trim() || "User",
            imageUrl: image_url,
            adresses:[],
            wishlist:[],
        };

        await User.create(newUser)
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        await connectDB();
        
        const {id} = event.data;
        await User.deleteOne({clerkId: id});
    }
);

export const functions =[syncUser, deleteUserFromDB];