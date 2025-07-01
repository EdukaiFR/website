import { Avatar, AvatarFallback } from "../ui/avatar";

export type RankCardProps = {
    ranking: {
        user: {
            firstname: string;
            lastname: string;
            profile_picture?: string;
        };
        score: number;
    };
    rank: number;
};

export const RankCard = ({ ranking, rank }: RankCardProps) => {
    return (
        <div className="w-full flex items-center justify-between rounded-lg bg-white p-4">
            {/* Rank */}
            <div className="flex items-center justify-center px-2 py-1 rounded-full border border-[#E3E3E7] text-[#6C757D] text-xs">
                {rank}
            </div>
            {/* User Infos (Centré) */}
            <div className="flex flex-1 justify-center items-center gap-3">
                {/* Avatar (fallback if ranking.user.profile_picture is undefined) */}
                <Avatar className="h-8 w-8 rounded-full">
                    {/* <AvatarImage src={"/temp/profile.svg"} alt={"Profile"} /> */}
                    <AvatarFallback className="rounded-full">
                        {ranking.user.firstname[0].toUpperCase()}
                        {ranking.user.lastname[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0 text-center">
                    <p className="satoshi-medium text-md">
                        {ranking.user.firstname} {ranking.user.lastname[0]}.
                    </p>
                    <p className="satoshi-medium text-sm text-black text-opacity-50">
                        {ranking.score}
                    </p>
                </div>
            </div>
        </div>
    );
};
