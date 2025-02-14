import { CounterBadge } from "@/components/badge/CounterBadge";
import { Button } from "@/components/ui/button";
import { columns } from "@/app/my-courses/[id]/sections/resume-files/columns";
import { resumeFilesValue } from "@/public/mocks/default-value";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table";

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
        <div className="flex items-center justify-end w-full ml-auto satoshi-medium">
          <Button
            variant={"ghost"}
            className="text-[#2D6BCF] text-sm hover:bg-[#2D6BCF]/10 hover:text-[#2D6BCF] rounded-full px-3 py-1 flex items-center gap-1"
            onClick={() => {}}
          >
            <Plus size={16} />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center w-full">
        <DataTable data={resumeFilesValue} columns={columns} />
      </div>
    </div>
  );
};
