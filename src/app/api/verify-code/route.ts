import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import {verifySchema} from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
    await dbConnect();

    try{
        const reqBody = await request.json();
        const {username, code} = reqBody;

        // otpCode validation
        const result = verifySchema.safeParse(code);
        console.log(result);
        
        if(!result.success){
            return NextResponse.json({
                success: false,
                status: 401,
                message: "OTP must be of 6 digit"
            })
        }

        const user = await userModel.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User not found"
            })
        }

        const isCodeValid = user.otpCode === code;
        const isCodeNotExpired = new Date(user.otpExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();

            return NextResponse.json({
                success: true,
                status: 200,
                message: "Account Verified Successfully"
            })
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({
                success: false,
                status: 400,
                message: "OTP expired, Please Signup again to get new code"
            })
        }
        else{
            return NextResponse.json({
                success: false,
                status: 401,
                message: "Invalid code"
            })
        }
    }
    
    catch(error: unknown){
        console.log("Something went wrong");

        if(error instanceof Error){
            console.log("An error occured, ", error.message);
        }
        else{
            console.log("An Unknown error", error);
        }

        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

