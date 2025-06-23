import Image from "next/image";

export type ResumeFileCardProps = {
    resume_file: {
        id: number;
        src: string;
        alt: string;
    };
};

export const ResumeFileCard = ({ resume_file }: ResumeFileCardProps) => {
    return (
        <div className="flex items-center justify-center">
            <Image
                src={resume_file.src}
                alt={resume_file.alt}
                width={150}
                height={150}
                className="rounded-lg shadow-lg border border-[#E3E3E7]"
            />
        </div>
    );
};
