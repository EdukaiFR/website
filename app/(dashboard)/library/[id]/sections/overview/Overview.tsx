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
  overview: unknown;
  examsData?: unknown[];
  createExam?: (courseId: string, title: string, description: string, date: Date) => void;
  getExams?: (courseId: string[]) => void;
  updateCourseData?: () => void;
  updateExam?: (examId: string, data: unknown) => void;
  deleteExam?: (examId: string) => void;
};

export const Overview = ({ 
  course_id, 
  overview, 
  examsData,
  createExam,
  getExams,
  updateCourseData,
  updateExam,
  deleteExam
}: OverviewProps) => {
  return (
    <div className="w-full flex flex-col lg:flex-row lg:justify-between h-full gap-4">
      {/* Left Side */}
      <div className="flex flex-col lg:w-[73%] gap-4 h-full">
        {/* Ligne 1 */}
        <div className="flex flex-col lg:flex-row gap-4 w-full h-[35%]">
          <div className="lg:w-1/2 flex-grow h-full">
            <Skills
              skills={[
                "Résoudre des équations quadratiques.",
                "Comprendre et interpréter les discriminants.",
              ]}
            />
          </div>{" "}
          {/* Compétences */}
          <div className="lg:w-1/2 flex-grow h-full">
            <LastQuiz lastQuiz={[]} />
          </div>{" "}
          {/* Derniers quiz */}
        </div>

        {/* Ligne 2 */}
        <div className="flex flex-col lg:flex-row gap-4 w-full h-[65%]">
          <div className="w-full lg:w-1/2 flex-grow h-full">
            <Exam 
              exams={examsData || examsValue}
              courseId={course_id}
              createExam={createExam}
              getExams={getExams}
              updateCourseData={updateCourseData}
              updateExam={updateExam}
              deleteExam={deleteExam}
            />
          </div>{" "}
          {/* Examen prévu */}
          <div className="w-full lg:w-1/2 flex-grow h-full">
            <ResumeFiles resume_files={resumeFilesValue} />
          </div>{" "}
          {/* Fiches de révision */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-full lg:w-[26%] gap-4 h-full">
        <div className="w-full h-[28%]">
          <Tips tips={["Astuce 1", "Astuce 2"]} />
        </div>{" "}
        {/* Astuce */}
        <div className="w-full h-[72%]">
          <Ranking ranking={rankings} />
        </div>{" "}
        {/* Classement */}
      </div>
    </div>
  );
};
