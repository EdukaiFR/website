import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { USER_ROLES, UserRole } from "./hooks/useRole";

interface JwtToken {
    userId: string;
    iat: number;
    exp: number;
    role?: UserRole;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookie = req.cookies.get("auth_token");

    let decodedToken: JwtToken | undefined;
    let userRole: UserRole | undefined;

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

            userRole = decodedToken.role;
        } catch (error) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== USER_ROLES.ADMIN) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|auth|reset-password|shared).*)", // /api, /static, file extensions, /_next, /auth, /reset-password, and /shared
    ]
};
