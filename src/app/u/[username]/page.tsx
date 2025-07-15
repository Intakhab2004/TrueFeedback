"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/common/ModeToggle";

type randomMessage = {
  id: number;
  text: string;
};

const MessagePage = () => {
  const [loader, setLoader] = useState(false);
  const [messageLoader, setMessageLoader] = useState(false);
  const [messageSuggestion, setMessageSuggestion] = useState<randomMessage[]>([]);
  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
      email: ""
    }
  });

  const sendMessageHandler = async (data: z.infer<typeof messageSchema>) => {
    setLoader(true);

    try {
      const result = await axios.post("/api/send-message", {
        username: params.username,
        content: data.message,
        email: data.email
      });

      if (!result.data.success) {
        const toastId = toast("Failed", {
          description: result.data.message,
          action: {
            label: "Dismiss",
            onClick: () => {
              toast.dismiss(toastId);
            },
          },
        });
      } else {
        const toastId = toast("Success", {
          description: result.data.message,
          action: {
            label: "Dismiss",
            onClick: () => {
              toast.dismiss(toastId);
            },
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(
          "Something went wrong while sending message: ",
          error.message
        );
      } else {
        console.log("An unknown error: ", error);
      }

      const toastId = toast("Something went wrong while sending message", {
        description: "Please try again",
        action: {
          label: "Dismiss",
          onClick: () => {
            toast.dismiss(toastId);
          },
        },
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSuggestMessage = async () => {
    setMessageLoader(true);
    try {
      const result = await axios.get("/api/suggest-messages");
      setMessageSuggestion(result.data.shuffledMessage || []);
    } catch (error) {
      console.log("Something went wrong while sending message: ", error);

      const toastId = toast(
        "Something went wrong while getting message suggestion",
        {
          description: "Please try again",
          action: {
            label: "Dismiss",
            onClick: () => {
              toast.dismiss(toastId);
            },
          },
        }
      );
    } finally {
      setMessageLoader(false);
    }
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    const toastId = toast("Message Copied", {
      description: "Message has been copied to clipboard",
      action: {
        label: "Dismiss",
        onClick: () => {
          toast.dismiss(toastId);
        },
      },
    });
  };

  useEffect(() => {
    handleSuggestMessage();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-[linear-gradient(354deg,rgba(0,0,0,1)_0%,rgba(25,25,60,1)_30%,rgba(10,40,60,1)_100%)]">
      <nav className="w-full p-4 md:p-6 shadow-lg mb-4 flex justify-around items-center dark:shadow-[0_2px_10px_rgba(0,200,255,0.2)] dark:bg-background">
        <p className="font-semibold">Be a part of Anonymous Gossips</p>
        <div className="flex space-x-4">
          <Button onClick={() => router.replace("/sign-up")}>
            Sign up
          </Button>
          <ModeToggle/>
        </div>
      </nav>
      <div className="w-full max-w-lg p-8">
        <h1 className="text-4x font-extrabold tracking-tight lg:text-5xl mb-3 text-center">
          Public Profile Link
        </h1>
      </div>

      <div className="w-7/12 space-y-4">
        <p>Send Anonymous Messages to @{params.username}</p>

        {/* message input field */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(sendMessageHandler)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write your Message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your email if you want reply of this message. It is optional</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-xs md:w-80"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loader}>
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send it"
              )}
            </Button>
          </form>
        </Form>

        <Separator className="mt-8"/>
      </div>

      

      <div className="w-7/12 space-y-4 mt-6">
        <p>Click on any Message below to select it</p>

        <div className="py-4 px-5 rounded-md shadow-lg dark:bg-transparent dark:shadow-[0_4px_10px_rgba(0,200,255,0.3)]">
          <h2 className="text-[1.4rem] font-bold">Messages</h2>
          {messageSuggestion.map((message) => (
            <div
              key={message.id}
              className="my-4 border-1 border-border text-center rounded-sm py-1 cursor-pointer"
              onClick={() => {
                copyMessage(message.text);
              }}
            >
              {message.text}
            </div>
          ))}
        </div>

        <Button onClick={handleSuggestMessage} className="mt-4 mb-10">
          {messageLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Suggest Message"
              )}
        </Button>
      </div>
    </div>
  );
};

export default MessagePage;