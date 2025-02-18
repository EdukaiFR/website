import { Separator } from "@/components/ui/separator";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export type LoadingUiProps = {
  step: 0 | 1 | 2 | 3 | 4;
  idCourse: string;
};

const steps = [
  { label: "Analyse" },
  { label: "Identification" },
  { label: "Création" },
  { label: "Finalisation" },
];

export const LoadingUi = ({ step, idCourse }: LoadingUiProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white shadow-md rounded-lg my-auto w-full lg:w-1/2 mx-auto">
      <h2 className="text-lg lg:text-2xl font-semibold text-black">
        {step < 4 ? "Génération..." : "Génération terminée !"}
      </h2>
      <div className="flex flex-col items-start lg:flex-row lg:items-center gap-1 mt-2 lg:gap-4 lg:mt-6">
        {steps.map((s, index) => (
          <>
            <div
              key={index}
              className="flex flex-row lg:flex-col items-center justify-start lg:justify-center lg:items-center gap-2 lg:mx-0"
            >
              <div
                className={
                  `w-16 h-16 flex items-center justify-center rounded-full bg-white border-[3px] ` +
                  (step > index
                    ? "border-[#3678FF]"
                    : "border-black border-opacity-20")
                }
              >
                {step > index ? (
                  <Check className="text-[#3678FF]" size={34} />
                ) : (
                  <p className="text-2xl font-semibold text-black text-opacity-20">
                    {index + 1}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold text-black text-opacity-75">
                {s.label}
              </p>
            </div>
            {index < 3 && (
              <Separator
                className={
                  `w-8 h-[2.5px] mb-5 rounded-full hidden lg:flex lg:mx-1 ` +
                  (step > index && " bg-[#3678FF] text-[#3678FF]")
                }
              />
            )}
          </>
        ))}
      </div>
      {step >= 4 && (
        <Link
          href={`/library/${idCourse}`}
          className="text-xs lg:text-sm bg-[#3678FF] rounded-lg text-white flex items-center justify-center gap-1 lg:gap-3 px-6 lg:px-12 py-2"
          onClick={() => {}}
        >
          Accéder à mon cours
          <ArrowRight className="ml-2" size={16} />
        </Link>
      )}
    </div>
  );
};
