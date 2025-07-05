import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


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

    const userId = new mongoose.Types.ObjectId(user._id);

    try{
        const user = await userModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])

        if(!user || user.length === 0){
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User not found"
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            messages: user[0].messages
        })
    }
    catch(error: unknown){
        console.log("Something went wrong while fetching the messages");
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