import { Metadata } from "next";
import { generateCourseMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    // Simplified approach for now - use generic course metadata
    // TODO: Integrate with actual API when available
    return generateCourseMetadata({
        title: "Cours",
        subject: "Matière",
        level: "Niveau",
        description:
            "Accédez à votre cours avec quiz et fiches de révision générés par IA.",
        courseId: params.id,
    });
}
