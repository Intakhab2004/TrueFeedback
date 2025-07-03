import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import userModel from "@/model/User";




export async function DELETE(request: NextRequest, {params}: {params: {messageId: string}}){
    const messageId = params.messageId;
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        console.log("User is not logged in");
        return NextResponse.json({
            success: false,
            statsu: 401,
            message: "User not authenticated"
        })
    }
     
    await dbConnect();

    try{
        const result = await userModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if(result.modifiedCount === 0){
            console.log("Message not deleted");
            return NextResponse.json({
                success: false,
                statsu: 402,
                message: "Something went wrong while deleting the message"
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Message deleted successfully"
        })
    }

    catch(error: unknown){
        console.log("Something went wrong");
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