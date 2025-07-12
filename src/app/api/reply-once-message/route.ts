import { sendEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/model/User";


export async function POST(request: NextRequest){
    const reqBody = await request.json();
    const {replyEmail, replyMessage, messageId, username} = reqBody;

    try{
        const emailResponse = await sendEmail({
            email: replyEmail, 
            emailType: "REPLY",
            username: username, 
            replyMessage: replyMessage

        });
        
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                status: 401,
                message: "Something went wrong while replying the message"
            })
        }

        const updatedUserMessage = await userModel.updateOne(
            {"messages._id": messageId},
            {$set: {
                "messages.$.replied": true,
                "messages.$.replyMessage": replyMessage
            }}
        )

        if(!updatedUserMessage){
            console.log("Something went wrong while updating the User Message");
            return NextResponse.json({
                success: false,
                status: 402,
                message: "Something went wrong while updating the message section"
            })
        }

        return NextResponse.json({
            success: true,
            status: 401,
            message: "You replied to the message"
        })
    }

    catch(error: unknown){
        console.log("Something went wrong while replying the message");
        if(error instanceof Error){
            console.log("An error occured while replying: ", error.message);
        }
        else{
            console.log("Unknown error: ", error);
        }
            
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}




