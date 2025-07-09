// import { Resend } from "resend";
// import VerificationEmail from "../../emails/verificationEmail";
// import { apiResponse } from "@/types/apiResponse";

// const resend = new Resend(process.env.RESEND_API_KEY);


// export async function sendEmail(email: string, username: string, otp: string): Promise<apiResponse>{
//     try{
//         await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: email,
//             subject: "True Feedback | Verification code",
//             react: VerificationEmail({username: username, otp: otp})
//         })

//         return {
//             success: true,
//             status: 200,
//             message: "Verification mail sent successfull"
//         }

//     }
//     catch(error){
//         console.log("Something went wrong while sending email");
//         console.log(error);
//         return {
//             success: false,
//             status: 500,
//             message: "Internal server error"
//         }
//     }
// }


import { apiResponse } from "@/types/apiResponse"
import nodemailer from "nodemailer"


export const sendEmail = async(email: string, username: string, otp: string): Promise<apiResponse> => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        
        const mailOptions = {
            from: `True Feedback ${process.env.MAIL_USER}`,
            to: email,
            subject: "True Feedback | Verification code",
            html: `
                    <div style="display: none; max-height: 0px; overflow: hidden;">
                        Here's your verification code: ${otp}
                    </div>

                    <div style="padding: 24px;">
                        <div style="margin-bottom: 16px;">
                            <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Hello ${username},</h2>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <p style="font-size: 16px; line-height: 1.5; margin: 0;">
                                Thank you for registering. Please use the following verification code to complete your registration:
                            </p>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <p style="font-size: 20px; font-weight: bold; color: #1a202c; margin: 12px 0;">${otp}</p>
                        </div>

                        <div style="margin-bottom: 16px;">
                            <p style="font-size: 16px; line-height: 1.5; margin: 0;">
                                If you did not request this code, please ignore this email.
                            </p>
                        </div>

                        <div style="margin-top: 20px;">
                            <a href="http://localhost:3000/verify/${username}"
                                style="display: inline-block; padding: 10px 20px; background-color: #61dafb; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Verify here
                            </a>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">© 2025 True Feedback. All rights reserved.</p>
                `,
        }
        
        const response = await transporter.sendMail(mailOptions);

        if(response.accepted.length > 0){
            return {
                success: true,
                status: 200,
                message: "Verification mail sent successfull"
            }
        }
        else{
            return {
                success: false,
                status: 500,
                message: "Something went wrong while sending the mail"
            }
        }
    }
    catch(error){
        console.error("Failed to send email:", error);
        return {
            success: false,
            status: 500,
            message: "Internal server error",
        }
    }
}
