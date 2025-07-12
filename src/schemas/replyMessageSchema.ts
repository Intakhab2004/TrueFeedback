import { z } from "zod";

export const replyMessageSchema = z.object({
    replyText: z.string()
                        .min(10, {message: "Message must be atleast 10 characters"})
                        .max(300, {message: "Message must be no longer than 300 characters"}),
})