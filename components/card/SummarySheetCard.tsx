import Image from "next/image";

export type SummarySheetCardProps = {
  summary_sheet: {
    id: number;
    src: string;
    alt: string;
  };
};

export const SummarySheetCard = ({ summary_sheet }: SummarySheetCardProps) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={summary_sheet.src}
        alt={summary_sheet.alt}
        width={150}
        height={150}
        className="rounded-lg shadow-lg border border-[#E3E3E7]"
      />
    </div>
  );
};
