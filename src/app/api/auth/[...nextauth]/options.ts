import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "abc@gmail.com" },
                password: { label: "Password", type: "password" }
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any): Promise<any>{
                await dbConnect();

                try{
                    const user = await userModel.findOne({email: credentials.email});

                    if(!user) throw new Error("User don't exists with this email");
                    if(!user.isVerified) throw new Error("Please verify your email before login");
                
                    const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password);
                    if(isPasswordCorrect) return user;
                    else throw new Error("Incorrect password");
                    

                }
                catch(error: unknown){
                    console.log("Something went wrong");
                    if(error instanceof Error){
                        throw new Error(error.message);
                    }
                    else{
                        throw new Error("An unknown error");
                    }
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            
            return session
        }
    },

    pages: {
        signIn: "/sign-in"
    },

    session: {
        strategy: "jwt"
    },

    secret: process.env.NEXTAUTH_SECRET,
}