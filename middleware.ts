import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtToken {
    userId: string;
    iat: number;
    exp: number;
    role?: string;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookie = req.cookies.get("auth_token");

    let decodedToken: JwtToken | undefined;
    let userRole: string | undefined;

    const adminRoutes = ["/admin"];

    if (!cookie) {
        console.log("There's no cookie ! Redirecting to /auth");
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    if (cookie) {
        try {
            decodedToken = jwtDecode<JwtToken>(cookie.value);
            const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

            if (isTokenExpired) {
                console.log("Token expired, redirecting...");
                return NextResponse.redirect(new URL("/auth", req.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (userRole != "admin") {
            console.log("Redirecting to unauthorized");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        //      Match all routes except
        "/((?!api|static|.*\\..*|_next|auth).*)", //      /api, /static, file extensions, /_next, and /auth
    ],
};
