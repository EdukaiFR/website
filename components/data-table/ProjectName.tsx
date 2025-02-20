import { ExternalLink } from "lucide-react";

const ProjectName = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-row items-center gap-3 py-2 cursor-pointer group w-80">
      <h1 className="font-medium text-base text-primary  hover:border-b hover:border-primary border-b border-transparent w-fit">
        {name}
      </h1>
      <ExternalLink className="w-4 h-4 text-gray-500 invisible group-hover:visible" />
    </div>
  );
};

export default ProjectName;
