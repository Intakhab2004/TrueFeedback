import { z } from "zod";

export const messageSchema = z.object({
    message: z.string()
                        .min(10, {message: "Message must be atleast 10 characters"})
                        .max(300, {message: "Message must be no longer than 300 characters"}),
    
    email: z.string()
                    .email({message: "Invalid email address"})
                    .or(z.literal("")) 
                    .optional()
})