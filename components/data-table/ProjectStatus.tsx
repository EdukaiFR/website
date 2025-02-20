import { STATUS } from "@/enum";

const statusBackgroundColors = {
  [STATUS.RISK]: "bg-[#FFEDEF]",
  [STATUS.ON_TRACK]: "bg-[#E1FCEF]",
  [STATUS.ON_HOLD]: "bg-gray-50",
  [STATUS.POTENTIAL_RISK]: "bg-[#FCF2E6]",
  [STATUS.ARCHIVED]: "bg-gray-50",
};

const statusTextColors = {
  [STATUS.RISK]: "text-[#D1293D]",
  [STATUS.ON_TRACK]: "text-[#14804A]",
  [STATUS.ON_HOLD]: "text-gray-600",
  [STATUS.POTENTIAL_RISK]: "text-[#AA5B00]",
  [STATUS.ARCHIVED]: "text-gray-600",
};

const statusDotBackgroundColors = {
  [STATUS.RISK]: "bg-[#D1293D]",
  [STATUS.ON_TRACK]: "bg-[#14804A]",
  [STATUS.ON_HOLD]: "bg-gray-600",
  [STATUS.POTENTIAL_RISK]: "bg-[#AA5B00]",
  [STATUS.ARCHIVED]: "bg-gray-600",
};

const statusLabels = {
  [STATUS.RISK]: "At Risk",
  [STATUS.ON_TRACK]: "On track",
  [STATUS.ON_HOLD]: "On hold",
  [STATUS.POTENTIAL_RISK]: "Potential risk",
  [STATUS.ARCHIVED]: "Archived",
};

const ProjectStatus = ({
  status,
}: {
  status:
    | STATUS.RISK
    | STATUS.ON_TRACK
    | STATUS.ON_HOLD
    | STATUS.POTENTIAL_RISK
    | STATUS.ARCHIVED;
}) => {
  return (
    <div
      className={`flex items-center justify-center w-fit h-6 px-3 gap-2 rounded-sm text-sm font-normal ${statusBackgroundColors[status]} ${statusTextColors[status]}`}
    >
      <div
        className={`w-2 h-2 rounded-[2px] ${statusDotBackgroundColors[status]}`}
      />
      {statusLabels[status]}
    </div>
  );
};

export default ProjectStatus;
