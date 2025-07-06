"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios from "axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const signUp = () => {

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [usernameUniqueLoader, setUsernameUniqueLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    // for displaying if the username is unique while filling the username
    const debounced = useDebounceCallback(setUsername, 300);

    // zod implementation
    const form = useForm <z.infer<typeof signUpSchema>> ({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async() => {
            if(username){
                setUsernameUniqueLoader(true);
                setUsernameMessage("");

                try{
                    const result = await axios.get(`/api/username-unique?username=${username}`);
                    setUsernameMessage(result.data.message);
                }
                catch(error){
                    console.log("Something went wrong while checking username: ", error);
                    setUsernameMessage("Error checking username")
                }
                finally{
                    setUsernameUniqueLoader(false);
                }
            }
        }

        checkUsernameUnique();

    }, [username])

    const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
        try{
            setLoader(true);
            const result = await axios.post("/api/signup", data);

            if(!result.data.success){
                console.log("An error occured: ", result.data.message);
                const toastId = toast(
                    "Something went wrong",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )
            }

            // If user successfully signed up
            else{
                const toastId = toast(
                    "Account has created successfully",
                    {
                        description: result.data.message,
                        action: {
                            label: "Dismiss",
                            onClick: () => {
                                toast.dismiss(toastId);
                            }
                        }
                    }
                )

                router.replace(`/verify/${username}`);
            }
        }

        catch(error: unknown){
            if(error instanceof Error){
                console.log("Something went wrong while signup: ", error.message);
            }
            else{
                console.log("An unknown error: ", error);
            }

            const toastId = toast(
                "Something went wrong while signing up",
                {
                    description: "Please try again",
                    action: {
                        label: "Dismiss",
                        onClick: () => {
                            toast.dismiss(toastId);
                        }
                    }
                }
            )
        }
        finally{
            setLoader(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4x font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous Gossips
                    </p>
                </div>

                {/* Signup Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" 
                                            {...field} 
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                        </FormControl>
                                        {
                                            usernameUniqueLoader && <Loader2 className="animate-spin"/>
                                        }
                                        {
                                            username && (
                                                <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                                                    {usernameMessage}
                                                </p>
                                            )
                                        }

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="abc123@gamil.com" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type = "password" placeholder="Password" 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled= {loader}>
                            {
                                loader ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                                            </>
                                         ) : ("Signup")
                            }
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <p>
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default signUp;