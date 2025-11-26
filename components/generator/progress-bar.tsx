import { memo } from "react";

interface ProgressBarProps {
    /** Current progress value (0-100) */
    value: number;
    /** Label to display above the progress bar */
    label?: string;
    /** Whether to show the percentage */
    showPercentage?: boolean;
    /** Custom className for styling */
    className?: string;
}

/**
 * ProgressBar - Animated progress bar component
 *
 * Features:
 * - Smooth transitions with CSS
 * - Gradient background
 * - Optional label and percentage display
 * - Memoized for performance
 */
export const ProgressBar = memo(function ProgressBar({
    value,
    label,
    showPercentage = true,
    className = "",
}: ProgressBarProps) {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Header with label and percentage */}
            {(label || showPercentage) && (
                <div className="flex justify-between items-center text-sm font-medium">
                    {label && <span className="text-gray-700">{label}</span>}
                    {showPercentage && (
                        <span className="text-gray-500 tabular-nums">
                            {Math.round(clampedValue)}%
                        </span>
                    )}
                </div>
            )}

            {/* Progress bar container */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                {/* Animated gradient bar */}
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${clampedValue}%` }}
                    role="progressbar"
                    aria-valuenow={clampedValue}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={label || "Progress"}
                >
                    {/* Shimmer effect for active progress */}
                    {clampedValue < 100 && clampedValue > 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    )}
                </div>
            </div>
        </div>
    );
});
