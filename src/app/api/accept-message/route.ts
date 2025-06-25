import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return NextResponse.json({
            success: false,
            status: 401,
            message: "User not authenticated"
        })
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = userModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            return NextResponse.json({
                success: false,
                status: 402,
                message: "Something went wrong while updating status of accepting messages"
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Messages acceptance status updated successfully",
            updatedUser
        })


    }
    catch(error: unknown){
        console.log("Something went wrong while updating status of accepting messages");
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

export async function GET(request: NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return NextResponse.json({
            success: false,
            status: 401,
            message: "User not authenticated"
        })
    }

    const userId = user._id;

    try{
        const getUser = await userModel.findById(userId);
        if(!getUser){
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User not found"
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "User message acceptance status is fetched",
            isAcceptingMessages: getUser.isAcceptingMessage
        })
    }
    catch(error: unknown){
        console.log("Something went wrong while getting the status");
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