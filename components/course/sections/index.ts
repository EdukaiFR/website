// Export sections avec des noms explicites pour éviter les conflits
export * from "./exams";
export * from "./objectives";
export * from "./overview";
export * from "./similar-courses";
export * from "./statistics";

// Exports avec alias pour éviter les conflits de noms
export { Quiz, EndQuizCard, PossibleAnswers } from "./quiz";
export { LastQuiz as QuizLastQuiz } from "./quiz";

export {
    AddResumeFile,
    FilePreviewDialog,
    columns as resumeColumns,
} from "./resume-files";
export { ResumeFiles as CourseResumeFiles } from "./resume-files";
