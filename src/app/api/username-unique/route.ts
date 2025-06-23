import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/model/User";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest){
    await dbConnect();

    try{
        const {searchParams} = new URL(request.url);
        const queryParams = {username: searchParams.get("username")} // zod validation wants object in safeParse function.

        // Validation
        const result = usernameQuerySchema.safeParse(queryParams);
        console.log(result);
        if(!result.success){
            return NextResponse.json({
                success: false,
                status: 401,
                message: "Invalid Username"
            })
        }

        const {username} = result.data;

        // DB call
        const existingVerifiedUser = await userModel.findOne({username, isVerified: true});
        if(existingVerifiedUser){
            return NextResponse.json({
                success: false,
                status: 402,
                message: "Username is already taken"
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Username is available"
        })

    } 
    catch(error){
        console.log("Something went wrong", error);
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}