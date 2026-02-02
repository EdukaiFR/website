import { memo, useId } from "react";

interface ProgressBarProps {
    /** Current progress value (0-100) */
    value: number;
    /** Label to display above the progress bar */
    label?: string;
    /** Whether to show the percentage */
    showPercentage?: boolean;
    /** Custom className for styling */
    className?: string;
    /** Additional description for screen readers */
    ariaDescription?: string;
}

/**
 * ProgressBar - Accessible animated progress bar component
 *
 * Features:
 * - Full ARIA support for accessibility
 * - Smooth transitions with CSS
 * - Gradient background
 * - Optional label and percentage display
 * - Memoized for performance
 *
 * @example
 * ```tsx
 * <ProgressBar
 *     value={75}
 *     label="Progression globale"
 *     showPercentage
 *     ariaDescription="Génération du cours en cours"
 * />
 * ```
 */
export const ProgressBar = memo(function ProgressBar({
    value,
    label,
    showPercentage = true,
    className = "",
    ariaDescription,
}: ProgressBarProps) {
    const labelId = useId();
    const descriptionId = useId();

    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const roundedValue = Math.round(clampedValue);

    // Generate aria-valuetext for better screen reader experience
    const getValueText = () => {
        if (roundedValue === 0) return "Non démarré";
        if (roundedValue === 100) return "Terminé";
        return `${roundedValue} pour cent`;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Header with label and percentage */}
            {(label || showPercentage) && (
                <div className="flex justify-between items-center text-sm font-medium">
                    {label && (
                        <span id={labelId} className="text-gray-700">
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span className="text-gray-500 tabular-nums" aria-hidden="true">
                            {roundedValue}%
                        </span>
                    )}
                </div>
            )}

            {/* Hidden description for screen readers */}
            {ariaDescription && (
                <span id={descriptionId} className="sr-only">
                    {ariaDescription}
                </span>
            )}

            {/* Progress bar container */}
            <div
                className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner"
                role="progressbar"
                aria-valuenow={roundedValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={getValueText()}
                aria-labelledby={label ? labelId : undefined}
                aria-describedby={ariaDescription ? descriptionId : undefined}
                aria-label={!label ? "Progression" : undefined}
            >
                {/* Animated gradient bar */}
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${clampedValue}%` }}
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
