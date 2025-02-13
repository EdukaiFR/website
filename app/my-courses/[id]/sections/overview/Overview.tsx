import { Exam } from "./Card/Exam";
import { LastQuiz } from "./Card/LastQuiz";
import { Skills } from "./Card/Skills";
import { Tips } from "./Card/Tips";

// TempValue for exam
const examsValue = [
  {
    examId: 1,
    title: "Contrôle",
    description: "Réviser tout le premier chapitre",
    date: new Date(2025, 1, 25), // 25 février 2025 (février = 1)
  },
  {
    examId: 2,
    title: "Bac blanc",
    description: "Réviser tous les chapitres",
    date: new Date(2025, 2, 27), // 27 mars 2025 (mars = 2)
  }
];

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
          <div className="w-1/2 bg-white rounded-lg p-4 flex-grow"></div>{" "}
          {/* Fiches de révision */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-[26%] gap-4">
        <div className="w-full h-1/4">
          <Tips tips={["Astuce 1", "Astuce 2"]} />
        </div>{" "}
        {/* Astuce */}
        <div className="w-full h-3/4 bg-white rounded-lg p-4"></div>{" "}
        {/* Classement */}
      </div>
    </div>
  );
};
