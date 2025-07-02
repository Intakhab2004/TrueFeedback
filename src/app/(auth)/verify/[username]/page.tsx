"use client"


import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import * as z from "zod";

const CodeVerification = () => {

    const [loading, setLoading] = useState(false);
    const params = useParams<{username : string}>();
    const router = useRouter();

    // zod implementation
    const form = useForm <z.infer<typeof verifySchema>> ({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otpCode: ""
        }
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        setLoading(true)
        
        try{
            console.log(data);
            const result = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.otpCode
            });

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

            else{
                const toastId = toast(
                    "Success",
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
                router.replace("/sign-in");
            }
        }

        catch(error: unknown){
            if(error instanceof Error){
                console.log("Something went wrong while verification: ", error.message);
            }
            else{
                console.log("An unknown error: ", error);
            }

            const toastId = toast(
                "Something went wrong while verification",
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
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4x font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your email
                    </p>
                </div>

                {/* OTP form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="otpCode"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>6-digit OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="XXXXXX" 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled= {loading}>
                            {
                                loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                                            </>
                                         ) : ("Submit")
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )


}

export default CodeVerification;