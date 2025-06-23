import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
            <div className="w-full max-w-md lg:max-w-6xl">{children}</div>
        </main>
    );
}
