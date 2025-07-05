import { z } from "zod";

export const usernameValidation = z.string()
                                   .min(1, "Username is required")
                                   .min(2, "Username must be atleast of 2 characters")
                                   .max(20, "Username must be no longer than 20 characters")
                                   .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"})
                     .min(1, {message: "Email is required"}),
    password: z.string().min(6, {message: "Password must be atleast of 6 characters"})
                        .min(1, {message: "Password is required"})
})