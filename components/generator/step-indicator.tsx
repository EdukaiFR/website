import { CheckCircle, Loader2, LucideIcon } from "lucide-react";
import { memo } from "react";

interface StepIndicatorProps {
    /** Icon component to display */
    icon: LucideIcon;
    /** Step label */
    label: string;
    /** Whether this step is currently active */
    active: boolean;
    /** Whether this step is completed */
    complete: boolean;
    /** Optional description */
    description?: string;
    /** Step number for screen readers (optional, auto-incremented in list) */
    stepNumber?: number;
    /** Total number of steps for screen readers */
    totalSteps?: number;
}

/**
 * StepIndicator - Accessible step indicator for multi-step progress
 *
 * Features:
 * - Full ARIA support with status announcements
 * - Visual indicators for pending/active/complete states
 * - Memoized for performance
 *
 * @example
 * ```tsx
 * <StepIndicator
 *     icon={FileText}
 *     label="Fichiers reçus"
 *     description="Vos fichiers ont été analysés"
 *     active={false}
 *     complete={true}
 *     stepNumber={1}
 *     totalSteps={4}
 * />
 * ```
 */
export const StepIndicator = memo(function StepIndicator({
    icon: Icon,
    label,
    active,
    complete,
    description,
    stepNumber,
    totalSteps,
}: StepIndicatorProps) {
    // Determine status for ARIA
    const getStatus = (): "pending" | "active" | "complete" => {
        if (complete) return "complete";
        if (active) return "active";
        return "pending";
    };

    const status = getStatus();

    // Generate accessible status text
    const getAriaLabel = () => {
        const stepInfo =
            stepNumber && totalSteps
                ? `Étape ${stepNumber} sur ${totalSteps}: `
                : "";
        const statusText =
            status === "complete"
                ? "terminée"
                : status === "active"
                  ? "en cours"
                  : "en attente";
        return `${stepInfo}${label}, ${statusText}${description ? `. ${description}` : ""}`;
    };

    return (
        <div
            role="listitem"
            aria-label={getAriaLabel()}
            aria-current={active ? "step" : undefined}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                active
                    ? "bg-blue-50 border-2 border-blue-200 shadow-md scale-105"
                    : complete
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-gray-50 border-2 border-gray-200 opacity-60"
            }`}
        >
            {/* Icon container */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    active
                        ? "bg-gradient-to-r from-blue-600 to-blue-500"
                        : complete
                          ? "bg-gradient-to-r from-green-600 to-green-500"
                          : "bg-gray-300"
                }`}
                aria-hidden="true"
            >
                {complete ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                ) : active ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                    <Icon className="w-5 h-5 text-gray-600" />
                )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-semibold transition-colors truncate ${
                        active
                            ? "text-blue-700"
                            : complete
                              ? "text-green-700"
                              : "text-gray-500"
                    }`}
                >
                    {label}
                </p>
                {description && (
                    <p
                        className={`text-xs transition-colors truncate ${
                            active
                                ? "text-blue-600"
                                : complete
                                  ? "text-green-600"
                                  : "text-gray-400"
                        }`}
                    >
                        {description}
                    </p>
                )}
            </div>

            {/* Status indicator - hidden from screen readers (redundant) */}
            <div className="flex-shrink-0" aria-hidden="true">
                <span className="text-lg">
                    {complete ? "✓" : active ? "" : "○"}
                </span>
            </div>
        </div>
    );
});
