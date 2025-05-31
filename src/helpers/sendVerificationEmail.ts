import { Resend } from "resend";
import VerificationEmail from "../../emails/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendEmail(email: string, username: string, otp: string): Promise<apiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "True Feedback | Verification code",
            react: VerificationEmail({username: username, otp: otp})
        })

        return {
            success: true,
            status: 200,
            message: "Verification mail sent successfull"
        }

    }
    catch(error){
        console.log("Something went wrong while sending email");
        console.log(error);
        return {
            success: false,
            status: 500,
            message: "Internal server error"
        }
    }
}

