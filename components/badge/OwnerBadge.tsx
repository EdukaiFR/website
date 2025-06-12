import Link from "next/link";

export type OwnerBadgeProps = {
  owner: string;
};

export const OwnerBadge = ({ owner }: OwnerBadgeProps) => {
  return (
    <Link
      href="#"
      className="flex items-center justify-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-medium border border-purple-200 shadow-sm hover:bg-white hover:border-purple-300 transition-all duration-200"
    >
      <p>@{owner}</p>
    </Link>
  );
};
