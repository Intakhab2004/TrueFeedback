import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware"


export async function middleware(request: NextRequest){
    const token = await getToken({req: request});
    
    const path = request.nextUrl.pathname;
    const isPublicPath = (path === "/") || (path === "/sign-in") || (path === "/sign-up") || path.startsWith("/verify");

    if(token && isPublicPath){
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if(!token && !isPublicPath){
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/verify/:path*",
    ]
}