import Image from "next/image";

export function EdukaiHeader() {
    return (
        <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                    <Image
                        src="/EdukaiLogo.svg"
                        alt="Logo Edukai"
                        width={32}
                        height={32}
                        className="sm:w-10 sm:h-10 rounded-full"
                    />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Edukai
                </h1>
            </div>
        </div>
    );
}
