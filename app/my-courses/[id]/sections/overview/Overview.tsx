import { Exam } from "./Card/Exam";
import { LastQuiz } from "./Card/LastQuiz";
import { Ranking } from "./Card/Ranking";
import { ResumeFiles } from "./Card/ResumeFiles";
import { Skills } from "./Card/Skills";
import { Tips } from "./Card/Tips";
import {
  examsValue,
  resumeFilesValue,
  rankings,
} from "@/public/mocks/default-value";

export type OverviewProps = {
  course_id: string;
  overview: any;
};

export const Overview = ({ course_id, overview }: OverviewProps) => {
  return (
    <div className="w-full flex justify-between min-h-[65vh] gap-4">
      {/* Left Side */}
      <div className="flex flex-col w-[73%] gap-4">
        {/* Ligne 1 */}
        <div className="flex gap-4 w-full h-1/3">
          <div className="w-1/2 flex-grow">
            <Skills
              skills={[
                "Résoudre des équations quadratiques.",
                "Comprendre et interpréter les discriminants.",
              ]}
            />
          </div>{" "}
          {/* Compétences */}
          <div className="w-1/2 flex-grow">
            <LastQuiz lastQuiz={[]} />
          </div>{" "}
          {/* Derniers quiz */}
        </div>

        {/* Ligne 2 */}
        <div className="flex gap-4 w-full h-2/3">
          <div className="w-1/2 flex-grow">
            <Exam exams={examsValue} />
          </div>{" "}
          {/* Examen prévu */}
          <div className="w-1/2 flex-grow">
            <ResumeFiles resume_files={resumeFilesValue} />
          </div>{" "}
          {/* Fiches de révision */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-[26%] gap-4">
        <div className="w-full h-1/4">
          <Tips tips={["Astuce 1", "Astuce 2"]} />
        </div>{" "}
        {/* Astuce */}
        <div className="w-full h-3/4">
          <Ranking ranking={rankings} />
        </div>{" "}
        {/* Classement */}
      </div>
    </div>
  );
};
