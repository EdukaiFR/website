import { ReactNode } from "react";
import { generateMetadata } from "./metadata";

export { generateMetadata };

export default function CourseLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}