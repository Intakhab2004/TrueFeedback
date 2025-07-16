import { analyzeSentimentHuggingFace } from "@/helpers/huggingFace";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    await dbConnect();

    try{
        const reqBody = await request.json();
        const {username, content, email} = reqBody;

        // Making AI api call to analyze sentiment
        const response = await analyzeSentimentHuggingFace(content);

        const user = await userModel.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User not found"
            })
        }

        // checking is user accepting the messages
        if(!user.isAcceptingMessage){
            return NextResponse.json({
                success: false,
                status: 403,
                message: "User is not accepting the messages"
            })
        }

        const newMessage = {
            content,
            createdAt: new Date(),
            replyEmail: email || undefined,
            label: response.data?.label,
            score: response.data?.score
        }

        user.messages.push(newMessage);
        await user.save();

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Message sent successfully"
        })

    }
    catch(error){
        console.log("Something went wrong while sending the messages");
        if(error instanceof Error){
            console.log("An error occured, ", error.message);
        }
        else{
            console.log("Unknown error, ", error);
        }
        
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}