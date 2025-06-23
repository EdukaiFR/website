import { Exams } from "@/components/course/sections/exams";
import { Objectives } from "@/components/course/sections/objectives";
import { Overview } from "@/components/course/sections/overview";
import { CourseResumeFiles } from "@/components/course/sections";
import { Statistics } from "@/components/course/sections/statistics";
import { SimilarCourses } from "@/components/course/sections/similar-courses";

export const navBarConfig = [
    { label: "Aperçu", tab: "overview", component: Overview },
    {
        label: "Fiches de révision",
        tab: "resumeFiles",
        component: CourseResumeFiles,
    },
    { label: "Examens", tab: "exams", component: Exams },
    { label: "Objectifs", tab: "objectives", component: Objectives },
    { label: "Statistiques", tab: "statistics", component: Statistics },
    {
        label: "Cours similaires",
        tab: "similarCourses",
        component: SimilarCourses,
    },
];
