export type BetaBadgeProps = {
    isBeta: boolean;
};

export const BetaBadge = ({ isBeta = false }: BetaBadgeProps) => {
    console.log(isBeta);
    return (
        <div className="w-fit ml-auto mr-auto flex items-center justify-center px-[5%] py-1 text-sm text-primary rounded-full border border-[#2d6bcf] bg-[#2d6bcf] bg-opacity-15">
            Beta
        </div>
    );
};
