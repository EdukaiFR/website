import { IterationCcw } from "lucide-react";

export type SkillsProps = {
  skills: string[];
};

export const Skills = (props: SkillsProps) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-start justify-between gap-3 h-full satoshi-medium ">
      <h3 className="text-lg text-[rgba(26, 32, 44, 1)]">Compétences</h3>
      <div className="flex flex-col items-start justify-start gap-4 h-full">
        {props.skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-2 text-sm"
          >
            <IterationCcw size={20} className="text-[#3678FF]" />
            <p className="text-[rgba(26, 32, 44, 1)] opacity-85">{skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
