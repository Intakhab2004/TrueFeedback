"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { replyMessageSchema } from "@/schemas/replyMessageSchema";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [loader, setLoader] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: session } = useSession();
  const username = session?.user.username;

  const form = useForm<z.infer<typeof replyMessageSchema>>({
    resolver: zodResolver(replyMessageSchema),
    defaultValues: {
      replyText: "",
    },
  });

  const date = new Date(message.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleDeleteConfirm = async () => {
    const result = await axios.delete(`/api/message-delete/${message._id}`);
    const toastId = toast("Success", {
      description: result.data.message,
      action: {
        label: "Dismiss",
        onClick: () => {
          toast.dismiss(toastId);
        },
      },
    });

    onMessageDelete(message._id as string);
  };

  const onSubmit = async (data: z.infer<typeof replyMessageSchema>) => {
    setLoader(true);
    try {
      const response = await axios.post("/api/reply-once-message", {
        replyEmail: message.replyEmail,
        replyMessage: data.replyText,
        messageId: message._id,
        username: username,
      });

      if (!response.data.success) {
        console.log("An error occured: ", response.data.message);
        const toastId = toast("Something went wrong", {
          description: response.data.message,
          action: {
            label: "Dismiss",
            onClick: () => {
              toast.dismiss(toastId);
            },
          },
        });
      } 
      
      else {
        const toastId = toast("Replied Successfully", {
          description: response.data.message,
          action: {
            label: "Dismiss",
            onClick: () => {
              toast.dismiss(toastId);
            },
          },
        });
      }
    } catch (error) {
      console.log("Something went wrong", error);
      const toastId = toast("An error occured", {
        description: "Something went wrong while replying",
        action: {
          label: "Dismiss",
          onClick: () => {
            toast.dismiss(toastId);
          },
        },
      });
    } finally {
      setLoader(false);
      setIsDialogOpen(false);
    }
  };

  const showDialogTrigger = (message.replyEmail !== undefined);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">
            {message.content}
          </CardTitle>

          {/* Alert Dialog box */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="cursor-pointer">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to delete this message?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="-mt-1">{date}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-3 sm:gap-6">
          <div className="flex-1 w-full">
            {
              !message.replied ? (
                                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {showDialogTrigger && (
                <DialogTrigger asChild>
                  <Button>Reply</Button>
                </DialogTrigger>
              )}
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reply to the tapped message</DialogTitle>
                    <DialogDescription>
                      You can reply only once to this message
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="replyText"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your message here"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loader}>
                          {loader ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Please wait
                            </>
                          ) : (
                            "Send"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
                                ) 
                                :
                                (
                                    <div className="p-3 border border-black/20 rounded-md w-full sm:max-w-xs bg-gray-50">
                                      <p className="text-black/40 text-xs mb-1">You replied to this message</p>
                                      <p className="text-sm font-semibold text-black">{message.replyMessage}</p>
                                    </div>
                                )
            }
          </div>

          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className={`text-sm font-semibold ${message.label === "POSITIVE" ? "text-green-600" : 
                          message.label === "NEGATIVE"? "text-red-600" : "text-gray-600"}`}
            >
              {message.label}
            </p>
            {
              message.score && (
                <p className="text-xs text-gray-500">
                  {`${(message.score*100).toFixed(1)}%`}
                </p>
              )
            }
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
