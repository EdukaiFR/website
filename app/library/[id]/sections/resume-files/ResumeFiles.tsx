import { columns } from "@/app/library/[id]/sections/resume-files/columns";
import { CounterBadge } from "@/components/badge/CounterBadge";
import { DataTable } from "@/components/data-table";
import { resumeFilesValue } from "@/public/mocks/default-value";
import { AddResumeFile } from "./AddResumeFile";

export type ResumeFilesProps = {
  course_id: string;
  resumeFiles: any[];
};

export const ResumeFiles = ({ course_id, resumeFiles }: ResumeFilesProps) => {
  return (
    <div className="w-full flex flex-col items-start justify-start min-h-[65vh] gap-2">
      {/* Header */}
      <div className="flex items-center justify-start w-full">
        {/* Left part */}
        <CounterBadge
          counter={resumeFiles?.length ?? 0}
          type="élements"
          size="sm"
        />
        {/* Right Part */}
        <div className="flex items-center justify-end w-full max-w-[16rem] md:max-w-[20rem] lg:max-w-full ml-auto satoshi-medium">
          <AddResumeFile />
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center w-full">
        <DataTable data={resumeFilesValue} columns={columns} />
      </div>
    </div>
  );
};
