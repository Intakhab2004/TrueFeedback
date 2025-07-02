"use client";

import {
  Card,
  CardAction,
  CardDescription,
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

import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner"
import axios from "axios";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const handleDeleteConfirm = async() => {
        const result = await axios.delete(`/api/message-delete/${message._id}`)
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

        onMessageDelete(message._id as string);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>

        {/* Alert Dialog box */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
                <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure to delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
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
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
