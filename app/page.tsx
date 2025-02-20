"use client";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 px-6 min-h-[calc(100vh-5rem)]">
      {/* Titre principal */}
      <div className="flex flex-col gap-1 items-start">
        <h1 className="text-4xl font-bold text-[#3C517C]">Bienvenue Tristan</h1>
        <p className="text-md text-medium-muted">
          Voici un petit résumé de ton compte
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {/* Bloc 1 : Prochain examen */}
        <div className="col-span-1 bg-gray-200 p-6 rounded-lg flex items-center justify-center">
          <p className="text-xl font-bold text-gray-600">Examen à venir</p>
        </div>

        {/* Bloc 2 : Tes objectifs */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-gray-300 p-6 rounded-lg flex items-center justify-center">
          <p className="text-xl font-bold text-gray-600">Objectifs</p>
        </div>

        {/* Bloc 3 : Activité récente */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-400 p-6 rounded-lg flex flex-1 items-center justify-center flex-grow w-full">
          <p className="text-xl font-bold text-gray-600">Activité récente</p>
        </div>
      </div>
    </div>
  );
}
