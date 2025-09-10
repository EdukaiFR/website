import { User } from "lucide-react";

export type OwnerBadgeProps = {
    owner: string;
};

export const OwnerBadge = ({ owner }: OwnerBadgeProps) => {
    return (
        <div className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-medium border border-purple-200 shadow-sm">
            <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <p>{owner}</p>
        </div>
    );
};
