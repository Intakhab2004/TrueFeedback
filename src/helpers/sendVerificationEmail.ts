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


import { otpTemplate } from "@/emails/otpVerification"
import { replyTemplate } from "@/emails/replyMessage"
import { apiResponse } from "@/types/apiResponse"
import nodemailer from "nodemailer"

type emailParams = {
    email: string, 
    emailType: string, 
    username?: string, 
    otp?: string,
    replyMessage?: string
}

export const sendEmail = async({
    email,
    emailType,
    username,
    otp,
    replyMessage
}: emailParams): Promise<apiResponse> => {

    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        
        const mailOptions = {
            from: `True Feedback ${process.env.MAIL_USER}`,
            to: email,
            subject: `${emailType === "REPLY" ? (`Reply from ${username} on TrueFeedback`) : ("True Feedback | Verification code")}`,
            html: `${
                        emailType === "VERIFYOTP" ? (otpTemplate(otp!, username!))
                                                :
                                                (replyTemplate(username!, replyMessage!))
                    }`
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
