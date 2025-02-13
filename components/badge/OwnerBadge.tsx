import Link from "next/link";

export type OwnerBadgeProps = {
  owner: string;
};

export const OwnerBadge = ({ owner }: OwnerBadgeProps) => {
  return (
    <Link
      href="#"
      className="flex items-center justify-center px-4 py-1 rounded-full bg-white bg-opacity-15 text-[#3678FF] text-sm font-semibold border-2 border-[#3678FF] hover:bg-[#3678FF] hover:bg-opacity-10"
    >
      <p>@{owner}</p>
    </Link>
  );
};
