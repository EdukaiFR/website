export type RevealPhase = "idle" | "wrong-shown" | "all-revealed";

export type AnswerIcon = "correct" | "wrong" | null;

interface AnswerStyleParams {
    isSelected: boolean;
    isAnswer: boolean;
    isCorrectAnswer: boolean;
    shouldShowCorrect: boolean;
    shouldShowWrong: boolean;
    revealPhase: RevealPhase;
}

interface AnswerStyles {
    buttonStyles: string;
    badgeStyles: string;
    icon: AnswerIcon;
}

export function getAnswerStyles({
    isSelected,
    isAnswer,
    isCorrectAnswer,
    shouldShowCorrect,
    shouldShowWrong,
    revealPhase,
}: AnswerStyleParams): AnswerStyles {
    if (isSelected && !isAnswer) {
        return {
            buttonStyles:
                "border border-blue-600 bg-blue-50 text-blue-700",
            badgeStyles: "bg-blue-100 text-blue-700",
            icon: null,
        };
    }

    if (shouldShowCorrect) {
        return {
            buttonStyles:
                "border-l-4 border-l-green-500 border-y border-r border-y-green-200 border-r-green-200 bg-green-100 text-green-900 font-semibold",
            badgeStyles: "bg-green-200 text-green-800",
            icon: "correct",
        };
    }

    if (shouldShowWrong) {
        return {
            buttonStyles:
                "border-l-4 border-l-red-500 border-y border-r border-y-red-200 border-r-red-200 bg-red-100 text-red-900 font-semibold",
            badgeStyles: "bg-red-200 text-red-800",
            icon: "wrong",
        };
    }

    if (revealPhase !== "idle" && !isCorrectAnswer && !isSelected) {
        return {
            buttonStyles:
                "border border-gray-200 bg-gray-50 text-gray-400",
            badgeStyles: "bg-gray-100 text-gray-400",
            icon: null,
        };
    }

    return {
        buttonStyles:
            "border border-gray-200 bg-white/80 text-gray-700 hover:bg-blue-50 hover:border-blue-300",
        badgeStyles: "bg-gray-100 text-gray-600",
        icon: null,
    };
}
