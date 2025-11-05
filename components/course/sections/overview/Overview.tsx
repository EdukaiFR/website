import { SummarySheetData } from "@/lib/types/library";
import { examsValue } from "@/public/mocks/default-value";
import { Exam } from "./Card/Exam";
import { LastQuiz } from "./Card/LastQuiz";
import { Ranking } from "./Card/Ranking";
import { Skills } from "./Card/Skills";
import { SummarySheets } from "./Card/SummarySheets";
import { Tips } from "./Card/Tips";

export type OverviewProps = {
    course_id: string;
    course_title?: string;
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
    insights_data?: {
        averageScore: number;
        insightsCount: number;
        insights?: Array<{
            score: number;
            createdAt: string;
        }>;
    };
    summarySheetsData?: SummarySheetData[];
};

export const Overview = ({
    course_id,
    course_title,
    overview,
    examsData,
    createExam,
    getExams,
    updateCourseData,
    updateExam,
    deleteExam,
    insights_data,
    summarySheetsData,
}: OverviewProps) => {
    console.log(overview);
    return (
        <div className="w-full h-full overflow-auto max-w-full">
            {/* Mobile: Single column, Tablet+: Two columns */}
            <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6 w-full max-w-full">
                {/* Main Content Area */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 xl:w-[68%] order-2 xl:order-1 w-full max-w-full min-w-0">
                    {/* Top Row - Skills and Quiz */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
                        <div className="h-80 lg:h-60 w-full min-w-0">
                            <Skills skills={[]} />
                        </div>
                        <div className="h-80 lg:h-60 w-full min-w-0">
                            <LastQuiz
                                lastQuiz={insights_data?.insights || []}
                                insights_data={insights_data}
                            />
                        </div>
                    </div>

                    {/* Bottom Row - Exam and Resume Files */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full">
                        <div className="min-h-96 lg:h-[32rem] w-full min-w-0">
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
                        <div className="min-h-96 lg:h-[32rem] w-full min-w-0">
                            <SummarySheets
                                summary_sheets={summarySheetsData || []}
                                courseTitle={course_title}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 xl:w-[32%] order-1 xl:order-2 w-full max-w-full min-w-0">
                    <div className="h-80 lg:h-60 w-full">
                        <Tips tips={[]} />
                    </div>
                    <div className="h-96 lg:h-[32rem] w-full">
                        <Ranking ranking={[]} />
                    </div>
                </div>
            </div>
        </div>
    );
};
