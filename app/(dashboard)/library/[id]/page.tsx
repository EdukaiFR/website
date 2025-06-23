"use client";

import { Header, NavBarComp } from "@/components/course";
import {
    CourseContentRenderer,
    CourseStyles,
    LoadingState,
} from "@/components/course/components";
import { navBarConfig } from "@/constants/course/constants";
import { useCourseLogic } from "@/hooks/course";

export default function MyCourses() {
    const {
        courseId,
        selectedTab,
        setSelectedTab,
        courseData,
        quizData,
        examsData,
        insightsData,
        quizId,
        insightsService,
        createExam,
        getExams,
        reFetchCourse,
        updateExam,
        deleteExam,
        loadCourseFiles,
    } = useCourseLogic();

    // Loading state
    if (!courseData || !quizData) {
        return <LoadingState />;
    }

    return (
        <div className="course-content flex flex-col gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 w-full max-w-full">
            <CourseStyles />

            <Header
                courseData={courseData}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />

            {selectedTab !== "quiz" && (
                <NavBarComp
                    setSelectedTab={setSelectedTab}
                    tabs={
                        navBarConfig as Array<{
                            label: string;
                            tab: string;
                            component: React.ComponentType<
                                Record<string, unknown>
                            >;
                        }>
                    }
                    selectedTab={selectedTab}
                />
            )}

            <CourseContentRenderer
                selectedTab={selectedTab}
                courseId={courseId}
                examsData={examsData}
                createExam={createExam}
                getExams={getExams}
                reFetchCourse={reFetchCourse}
                updateExam={updateExam}
                deleteExam={deleteExam}
                quizId={quizId}
                insightsService={insightsService}
                insightsData={insightsData}
                quizData={quizData}
                loadCourseFiles={loadCourseFiles}
            />
        </div>
    );
}
