import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Since we're using client-side authentication with localStorage,
// we'll let the client-side AuthGuard components handle route protection
// This middleware only handles static file serving and basic routing
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all paths - client-side auth guards will handle protection
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
