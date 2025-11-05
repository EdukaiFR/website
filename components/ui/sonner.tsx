"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-none group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border group-[.toaster]:border-blue-100/50",
                    description: "group-[.toast]:text-gray-600",
                    actionButton:
                        "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-600 group-[.toast]:to-blue-500 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-semibold group-[.toast]:shadow-lg group-[.toast]:hover:shadow-xl group-[.toast]:transition-all",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:hover:bg-gray-200 group-[.toast]:transition-all",
                    success:
                        "group-[.toaster]:border-l-4 group-[.toaster]:border-l-green-500",
                    error: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500",
                    warning:
                        "group-[.toaster]:border-l-4 group-[.toaster]:border-l-orange-500",
                    info: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-blue-500",
                },
                style: {
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
