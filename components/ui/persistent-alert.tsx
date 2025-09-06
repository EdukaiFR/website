"use client";

import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PersistentAlertProps {
    type: "success" | "error" | "warning" | "info";
    message: string;
    title?: string;
    onDismiss?: () => void;
    dismissible?: boolean;
    className?: string;
}

const alertConfig = {
    success: {
        icon: CheckCircle,
        className: "border-green-200 bg-green-50 text-green-800",
        iconClassName: "text-green-600",
    },
    error: {
        icon: XCircle,
        className: "border-red-200 bg-red-50 text-red-800",
        iconClassName: "text-red-600",
    },
    warning: {
        icon: AlertCircle,
        className: "border-yellow-200 bg-yellow-50 text-yellow-800", 
        iconClassName: "text-yellow-600",
    },
    info: {
        icon: Info,
        className: "border-blue-200 bg-blue-50 text-blue-800",
        iconClassName: "text-blue-600",
    },
} as const;

export function PersistentAlert({
    type,
    message,
    title,
    onDismiss,
    dismissible = true,
    className = "",
}: PersistentAlertProps) {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div className={cn("p-4 rounded-lg border-2 shadow-md", config.className, className)}>
            <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconClassName)} />
                <div className="flex-1 space-y-1">
                    {title && (
                        <h4 className="text-sm font-semibold">{title}</h4>
                    )}
                    <div className="text-sm leading-relaxed">
                        {message}
                    </div>
                </div>
                {dismissible && onDismiss && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDismiss}
                        className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 rounded-full"
                        aria-label="Fermer l'alerte"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Hook for managing multiple persistent alerts
export function usePersistentAlerts() {
    const [alerts, setAlerts] = React.useState<
        Array<PersistentAlertProps & { id: string }>
    >([]);

    const removeAlert = React.useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    const addAlert = React.useCallback((alert: Omit<PersistentAlertProps, 'onDismiss'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setAlerts(prev => [...prev, { ...alert, id, onDismiss: () => removeAlert(id) }]);
        return id;
    }, [removeAlert]);

    const clearAllAlerts = React.useCallback(() => {
        setAlerts([]);
    }, []);

    const addSuccess = React.useCallback((message: string, title?: string) => {
        return addAlert({ type: 'success', message, title });
    }, [addAlert]);

    const addError = React.useCallback((message: string, title?: string) => {
        return addAlert({ type: 'error', message, title });
    }, [addAlert]);

    const addWarning = React.useCallback((message: string, title?: string) => {
        return addAlert({ type: 'warning', message, title });
    }, [addAlert]);

    const addInfo = React.useCallback((message: string, title?: string) => {
        return addAlert({ type: 'info', message, title });
    }, [addAlert]);

    return {
        alerts,
        addAlert,
        removeAlert,
        clearAllAlerts,
        addSuccess,
        addError,
        addWarning,
        addInfo,
    };
}

// Container component for displaying multiple alerts
interface PersistentAlertsContainerProps {
    alerts: Array<PersistentAlertProps & { id: string }>;
    className?: string;
}

export function PersistentAlertsContainer({ 
    alerts, 
    className = "" 
}: PersistentAlertsContainerProps) {
    if (alerts.length === 0) return null;

    return (
        <div className={cn("space-y-3", className)}>
            {alerts.map(alert => (
                <PersistentAlert
                    key={alert.id}
                    type={alert.type}
                    message={alert.message}
                    title={alert.title}
                    onDismiss={alert.onDismiss}
                    dismissible={alert.dismissible}
                />
            ))}
        </div>
    );
}