import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Arrow } from "@radix-ui/react-tooltip";

const ProjectManager = ({ name }: { name: string }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <Avatar className="w-7 h-7 rounded-md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {name[0]} {name.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-900 text-base">
          <Arrow />
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProjectManager;
