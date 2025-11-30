import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardSkeletonProps {
    count?: number;
}

export const StatCardSkeleton = ({ count = 1 }: StatCardSkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Card
                    key={i}
                    className="border border-gray-100 shadow-lg bg-white"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export const PageLoadingSkeleton = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header Skeleton */}
            <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-pulse" />
                        <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-64 animate-pulse" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                    <svg
                        className="w-full h-12 text-white"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 120"
                        fill="currentColor"
                    >
                        <path d="M0,120 C240,60 480,60 720,80 C960,100 1200,40 1440,60 L1440,120 Z" />
                    </svg>
                </div>
            </header>

            {/* Main Content Skeleton */}
            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCardSkeleton count={4} />
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className="h-16 bg-gray-100 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
