import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "@/lib/db"; 

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: { 
        enabled: true, 
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "reader",input: true },
            isVerified: { type: "boolean", defaultValue: false } 
        }
    },
    secret: process.env.BETTER_AUTH_SECRET,
});