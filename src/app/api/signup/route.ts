import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/model/User";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: NextRequest){
    await dbConnect();

    try{
        const reqBody = await request.json();
        const {email, username, password} = reqBody;

        const existingVerifiedUser = await userModel.findOne({username, isVerified: true});
        if(existingVerifiedUser){
            console.log("User already exists");
            return NextResponse.json({
                success: false,
                status: 400,
                message: "User already exists"
            })
        }

        const existingUserByEmail = await userModel.findOne({email});

        // 6-Digits otp generation
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    status: 401,
                    message: "User exists with this email"
                })
            }
            else{
                const hashedPassword = await bcryptjs.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.otpCode = otpCode;
                existingUserByEmail.otpExpiry = new Date(Date.now() + 60*60*1000);

                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcryptjs.hash(password, 10);

            //expiry date setting
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                otpCode,
                otpExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        // sending verification email
        const emailResponse = await sendEmail(email, username, otpCode);
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                status: 401,
                message: emailResponse.message
            })
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Please check your email for verification"
        })

    }
    catch(error: unknown){
        console.log("Something went wrong while Signup");
        if(error instanceof Error){
            console.log(error.message);
        }
        else{
            console.log("Unknown error", error);
        }

        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}