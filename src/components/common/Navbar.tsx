"use client"


import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth"
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-background">
            <div className="container mx-auto flex flex-col md:flex-row 
                  items-center md:justify-between text-center md:text-left space-y-3 md:space-y-0">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </a>
                {
                    session && (
                        <p className="hidden md:block mr-4">Welcome, {user?.username}</p>
                    )
                }
                <div className="flex space-x-4">
                    {
                        session ? (
                                    <>
                                        
                                        <Button onClick={() => signOut({callbackUrl: "/"})} className="p-4 md:w-auto">
                                            Logout
                                        </Button>
                                    </>
                                ) :
                                (
                                    <Link href="/sign-in">
                                        <Button className="w-full md:w-auto">
                                            Login
                                        </Button>
                                    </Link>
                                )
                    }
                    <ModeToggle/>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;