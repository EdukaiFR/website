import { NotepadText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Arrow } from "@radix-ui/react-tooltip";

const ProjectLastUpdate = ({ date }: { date: string }) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <NotepadText className="w-5 h-5 text-primary" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 w-96 text-base">
            <Arrow />
            This is a note, user fills in while changing the status, which
            explains the current project status.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-base font-light">{date}</p>
    </div>
  );
};

export default ProjectLastUpdate;
