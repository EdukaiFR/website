import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateApiError } from "@/lib/toast";

export interface FormAlertProps {
    type: "error" | "success" | "warning" | "info";
    message: string;
    description?: string;
    className?: string;
    onDismiss?: () => void;
}

const alertConfig = {
    error: {
        icon: AlertCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-600",
        iconColor: "text-red-500",
    },
    success: {
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        iconColor: "text-green-500",
    },
    warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-600",
        iconColor: "text-yellow-500",
    },
    info: {
        icon: Info,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        iconColor: "text-blue-500",
    },
};

export function FormAlert({
    type,
    message,
    description,
    className,
    onDismiss,
}: FormAlertProps) {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "p-3 rounded-lg border flex items-start gap-3",
                config.bgColor,
                config.borderColor,
                className
            )}
        >
            <Icon
                className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)}
            />
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", config.textColor)}>
                    {message}
                </p>
                {description && (
                    <p
                        className={cn(
                            "text-sm mt-1 opacity-90",
                            config.textColor
                        )}
                    >
                        {description}
                    </p>
                )}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={cn(
                        "flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors",
                        config.textColor
                    )}
                    aria-label="Fermer"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

// Convenience components for specific alert types
export function FormErrorAlert({
    message,
    description,
    className,
    onDismiss,
}: Omit<FormAlertProps, "type">) {
    return (
        <FormAlert
            type="error"
            message={translateApiError(message)}
            description={description}
            className={className}
            onDismiss={onDismiss}
        />
    );
}

export function FormSuccessAlert({
    message,
    description,
    className,
    onDismiss,
}: Omit<FormAlertProps, "type">) {
    return (
        <FormAlert
            type="success"
            message={message}
            description={description}
            className={className}
            onDismiss={onDismiss}
        />
    );
}

export function FormWarningAlert({
    message,
    description,
    className,
    onDismiss,
}: Omit<FormAlertProps, "type">) {
    return (
        <FormAlert
            type="warning"
            message={message}
            description={description}
            className={className}
            onDismiss={onDismiss}
        />
    );
}

export function FormInfoAlert({
    message,
    description,
    className,
    onDismiss,
}: Omit<FormAlertProps, "type">) {
    return (
        <FormAlert
            type="info"
            message={message}
            description={description}
            className={className}
            onDismiss={onDismiss}
        />
    );
}
