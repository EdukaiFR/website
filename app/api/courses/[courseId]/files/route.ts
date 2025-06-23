import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const { courseId } = params;
        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format");

        // URL de l'API externe
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const externalApiUrl = `${apiUrl}/courses/${courseId}/files`;

        // Récupérer les données depuis l'API externe
        const response = await fetch(externalApiUrl, {
            headers: {
                // Transférer les cookies de la requête originale si nécessaire
                Cookie: request.headers.get("cookie") || "",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch course files" },
                { status: response.status }
            );
        }

        // Si le format base64 est demandé
        if (format === "base64") {
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");

            return new NextResponse(base64, {
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }

        // Sinon, retourner les données telles quelles
        const data = await response.arrayBuffer();
        return new NextResponse(data, {
            headers: {
                "Content-Type":
                    response.headers.get("Content-Type") ||
                    "application/octet-stream",
            },
        });
    } catch (error) {
        console.error("Error in files API route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
