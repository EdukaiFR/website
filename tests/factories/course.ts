export interface CourseData {
    _id: string;
    title: string;
    subject: string;
    level: string;
    visibility: "public" | "private";
    userId: string;
    createdAt: string;
    updatedAt: string;
}

let courseIdCounter = 0;

export function buildCourse(overrides?: Partial<CourseData>): CourseData {
    courseIdCounter++;
    const now = new Date().toISOString();
    return {
        _id: `course-${courseIdCounter}`,
        title: `Test Course ${courseIdCounter}`,
        subject: "Informatique",
        level: "Licence 1",
        visibility: "private",
        userId: "user-1",
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
}
