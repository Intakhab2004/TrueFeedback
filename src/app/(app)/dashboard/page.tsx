"use client"

import { Message } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessage } from "@/schemas/acceptMessageSchema";
import * as z from "zod"
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/common/MessageCard";


const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loader, setLoader] = useState(false);
    const [switchLoader, setSwitchLoader] = useState(false);
    const router = useRouter();
    const {data: session} = useSession();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => {
            message._id !== messageId
        }))
    }

    const form = useForm<z.infer<typeof acceptMessage>>({
        resolver: zodResolver(acceptMessage)
    })

    const {register, watch, setValue} = form;
    const acceptingMessage = watch("acceptingMessage")

    const fetchAcceptMessage = useCallback(async() => {
        setSwitchLoader(true);
        try{
            const result = await axios.get("/api/accept-message");
            setValue("acceptingMessage", result.data.isAcceptingMessages);
        }
        catch(error){
            console.log("Something went wrong while fetching the status: ", error);
            const toastId = toast(
                "Something went wrong while fetching the status",
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
            setSwitchLoader(false);
        }

    }, [setValue])

    const fetchMessages = useCallback(async(refresh: boolean = false) => {
        setLoader(true);
        setSwitchLoader(false);

        try{
            const result = await axios.get("/api/get-messages");
            setMessages(result.data.messages || []);

            if(refresh){
                const toastId = toast(
                    "Refreshed Messages",
                    {
                        description: "Showing refreshed messages",
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
        catch(error){
            console.log("Something went wrong while fetching the messages: ", error);
            const toastId = toast(
                "Failed",
                {
                    description: "Something went wrong while fetching the messages",
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
            setSwitchLoader(false);
        }

    }, [setLoader, setMessages])

    useEffect(() => {
        if(!session || !session.user) return
        fetchMessages();
        fetchAcceptMessage();

    }, [session, setValue, fetchMessages, fetchAcceptMessage]);

    const handleSwitchChange = async() => {
        try{
            const result = await axios.post("/api/accept-message", {acceptMessages: !acceptingMessage});
            setValue("acceptingMessage", result.data.updatedUser);

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
        }
        catch(error){
            console.log("Something went wrong while changing the status: ", error);
            const toastId = toast(
                "Failed",
                {
                    description: "Internal server error",
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

    if(!session || !session.user){
        return (
            <div>Please Login to be a part of Anonymous Gossips</div>
        )
    }

    const {username} = session.user;
    const baseUrl  = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        const toastId = toast(
            "URL Copied",
            {
                description: " Profile URL has been copied to clipboard",
                action: {
                    label: "Dismiss",
                    onClick: () => {
                        toast.dismiss(toastId);
                    }
                }
            }
        )
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">
                User Dashboard
            </h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                    Copy Your Unique Link
                </h2>{" "}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>
                        Copy
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptingMessage")}
                    checked={acceptingMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={switchLoader}
                />
                <span className="ml-2">
                    Accept Messages: {acceptingMessage ? "On" : "Off"}
                </span>
            </div>

            <Separator/>

            <Button 
                className="mt-4" 
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}  
            >
                {
                    loader ? (<Loader2 className="h-4 w-4 animate-spin" />)
                             :
                             (<RefreshCcw className="h-4 w-4" />)
                }
            </Button>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-2 gap-6">
                {
                    messages.length > 0 ? 
                                        (
                                            messages.map((message) => {
                                                return (
                                                    <MessageCard
                                                        key={message._id}
                                                        message={message}
                                                        onMessageDelete={handleDeleteMessage}
                                                    />
                                                )
                                            })
                                        ) 
                                        :
                                        (<p>No Messages to display</p>)
                }
            </div>
        </div>
    )
}

export default DashboardPage;