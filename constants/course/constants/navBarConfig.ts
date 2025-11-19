import { CourseSummarySheets } from "@/components/course/sections";
import { Exams } from "@/components/course/sections/exams";
import MyFiles from "@/components/course/sections/Files/MyFiles";
import { Overview } from "@/components/course/sections/overview";
import { Statistics } from "@/components/course/sections/statistics";

export const navBarConfig = (isPrivateView: boolean) => [
    { label: "Aperçu", tab: "overview", component: Overview },
    {
        label: "Fiches de révision",
        tab: "summarySheets",
        component: CourseSummarySheets,
    },
    { label: "Examens", tab: "exams", component: Exams },
    // { label: "Objectifs", tab: "objectives", component: Objectives },
    { label: "Statistiques", tab: "statistics", component: Statistics },
    // {
    //     label: "Cours similaires",
    //     tab: "similarCourses",
    //     component: SimilarCourses,
    // },
    {
        label: isPrivateView ? "Mes fichiers" : "Fichiers",
        tab: "myFiles",
        component: MyFiles,
    },
];
