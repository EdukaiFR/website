import { ChevronRight } from "lucide-react";

const ProjectTimeLine = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return (
    <div className="flex gap-2 items-center text-sm font-normal text-gray-700">
      <span className="bg-gray-200 h-6 px-3 rounded flex items-center">
        {startDate}
      </span>
      <ChevronRight className="w-4 h-4 " />
      <span className="bg-gray-200 h-6 px-3 rounded flex items-center">
        {endDate}
      </span>
    </div>
  );
};

export default ProjectTimeLine;
