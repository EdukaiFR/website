export function LoadingState() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6 px-3 sm:px-4 lg:px-8 py-3 sm:py-6 min-h-[calc(100vh-3.5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            <div className="flex items-center justify-center w-full h-full min-h-[50vh] sm:min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Chargement du cours...
                    </p>
                </div>
            </div>
        </div>
    );
}
