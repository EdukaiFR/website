import Image from "next/image";

export function EdukaiHeader() {
    return (
        <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
                <Image
                    src="/LOGO - Edukai v2.svg"
                    alt="Logo Edukai"
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl"
                />
                <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Edukai
                    </h1>
                    <p className="text-xs text-gray-500">Révise mieux, pas plus</p>
                </div>
            </div>
        </div>
    );
}
