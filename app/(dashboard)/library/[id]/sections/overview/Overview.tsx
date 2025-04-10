import {
  examsValue,
  rankings,
  resumeFilesValue,
} from "@/public/mocks/default-value";
import { Exam } from "./Card/Exam";
import { LastQuiz } from "./Card/LastQuiz";
import { Ranking } from "./Card/Ranking";
import { ResumeFiles } from "./Card/ResumeFiles";
import { Skills } from "./Card/Skills";
import { Tips } from "./Card/Tips";

export type OverviewProps = {
  course_id: string;
  overview: any;
};

export const Overview = ({ course_id, overview }: OverviewProps) => {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:justify-between min-h-[65vh] gap-4">
      {/* Left Side */}
      <div className="flex flex-col lg:w-[73%] gap-4">
        {/* Ligne 1 */}
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:h-1/3">
          <div className="lg:w-1/2 flex-grow">
            <Skills
              skills={[
                "Résoudre des équations quadratiques.",
                "Comprendre et interpréter les discriminants.",
              ]}
            />
          </div>{" "}
          {/* Compétences */}
          <div className="lg:w-1/2 flex-grow">
            <LastQuiz lastQuiz={[]} />
          </div>{" "}
          {/* Derniers quiz */}
        </div>

        {/* Ligne 2 */}
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 w-full lg:h-2/3">
          <div className="w-full lg:w-1/2 flex-grow">
            <Exam exams={examsValue} />
          </div>{" "}
          {/* Examen prévu */}
          <div className="w-full lg:w-1/2 flex-grow">
            <ResumeFiles resume_files={resumeFilesValue} />
          </div>{" "}
          {/* Fiches de révision */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-full lg:w-[26%] gap-4">
        <div className="w-full lg:h-1/4">
          <Tips tips={["Astuce 1", "Astuce 2"]} />
        </div>{" "}
        {/* Astuce */}
        <div className="w-full lg:h-3/4">
          <Ranking ranking={rankings} />
        </div>{" "}
        {/* Classement */}
      </div>
    </div>
  );
};
