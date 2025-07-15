"use client"


import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner"
import { signIn } from "next-auth/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";

const SignInPage = () => {

  const [loader, setLoader] = useState(false);
  const [alertBox, setAlertBox] = useState(false);
  const router = useRouter();

  // zod validation
  const form = useForm <z.infer<typeof signInSchema>> ({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async(data: z.infer<typeof signInSchema>) => {
    setLoader(true);
    try{
        if(!data.identifier || !data.password){
          const toastId = toast(
            "Please fill all the details carefully",
            {
              description: "All fields are mandatory",
              action: {
                label: "Dismiss",
                onClick: () => {
                  toast.dismiss(toastId);
                }
              }
            }
          )
          return;
        }

        const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      console.log("SignIn result: ", result);

      if(result?.error){
        if(result.error === "Please verify your email before login"){
          setAlertBox(true);
        }

        else{
          const toastId = toast(
            "Something went wrong",
            {
              description: result.error,
              action: {
                label: "Dismiss",
                onClick: () => {
                  toast.dismiss(toastId);
                }
              }
            }
          )
        }
      }

      if(result?.url){
        router.replace("/dashboard");
      }
    }
    finally{
      setLoader(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative dark:bg-[linear-gradient(354deg,rgba(0,0,0,1)_0%,rgba(25,25,60,1)_30%,rgba(10,40,60,1)_100%)]">
        {
          alertBox && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur z-20 flex items-center justify-center">
              <Alert variant="destructive" className="absolute z-50 top-70 w-full max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Please verify your email before login</AlertTitle>
                <AlertDescription>
                  You need to Sign up again to get the verification code.
                  <Button 
                    className="mt-2 bg-white text-black border-1 cursor-pointer border-red-500 hover:bg-white"
                    onClick={() => {setAlertBox(false)}}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )
        }
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-transparent dark:shadow-[0_4px_10px_rgba(0,200,255,0.3)]">
        <div className="text-center">
          <h1 className="text-4x font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">
            Sign in to start your anonymous Gossips
          </p>
        </div>

        {/* Sign in form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email/Username" 
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
                      <Input type="password" placeholder="Password" 
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
                         ) : ("Login")
              }
            </Button>
          </form>

          <div className="text-center mt-4">
            <p>
              New to True Feedback?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign up
                </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage;

