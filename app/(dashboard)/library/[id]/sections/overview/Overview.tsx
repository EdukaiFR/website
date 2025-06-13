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
  createExam?: (
    courseId: string,
    title: string,
    description: string,
    date: Date
  ) => void;
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
  deleteExam,
}: OverviewProps) => {
  return (
    <div className="w-full h-full overflow-auto max-w-full">
      {/* Mobile: Single column, Tablet+: Two columns */}
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6 h-full min-h-[600px] sm:min-h-[700px] xl:min-h-[500px] w-full max-w-full">
        {/* Main Content Area */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 xl:w-[68%] order-2 xl:order-1 w-full max-w-full min-w-0">
          {/* Top Row - Skills and Quiz */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 h-auto lg:h-[180px] xl:h-[25%] w-full">
            <div className="min-h-[200px] lg:min-h-0 w-full min-w-0">
              <Skills
                skills={[
                  "Résoudre des équations quadratiques.",
                  "Comprendre et interpréter les discriminants.",
                ]}
              />
            </div>
            <div className="min-h-[200px] lg:min-h-0 w-full min-w-0">
              <LastQuiz lastQuiz={[]} />
            </div>
          </div>

          {/* Bottom Row - Exam and Resume Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 flex-1 min-h-[400px] sm:min-h-[500px] lg:min-h-0 w-full">
            <div className="min-h-[350px] lg:min-h-0 w-full min-w-0">
              <Exam
                exams={examsData || examsValue}
                courseId={course_id}
                createExam={createExam}
                getExams={getExams}
                updateCourseData={updateCourseData}
                updateExam={updateExam}
                deleteExam={deleteExam}
              />
            </div>
            <div className="min-h-[350px] lg:min-h-0 w-full min-w-0">
              <ResumeFiles resume_files={resumeFilesValue} />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 xl:w-[32%] order-1 xl:order-2 w-full max-w-full min-w-0">
          <div className="min-h-[150px] xl:h-[28%] w-full">
            <Tips tips={["Astuce 1", "Astuce 2"]} />
          </div>
          <div className="min-h-[300px] sm:min-h-[400px] xl:min-h-0 xl:h-[72%] w-full">
            <Ranking ranking={rankings} />
          </div>
        </div>
      </div>
    </div>
  );
};
