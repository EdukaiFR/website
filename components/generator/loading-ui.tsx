import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoadingUiProps = {
  step: 0 | 1 | 2 | 3 | 4;
  idCourse: string;
};

const steps = [
  {
    id: 1,
    title: "Analyse",
    description: "Analyse des fichiers uploadés",
    icon: FileText,
  },
  {
    id: 2,
    title: "Identification",
    description: "Identification du contenu principal",
    icon: Clock,
  },
  {
    id: 3,
    title: "Création",
    description: "Génération du cours et des questions",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Finalisation",
    description: "Préparation de votre cours personnalisé",
    icon: CheckCircle,
  },
];

export function LoadingUi({ step, idCourse }: LoadingUiProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressValue = (step / 4) * 100;
    setProgress(progressValue);
  }, [step]);

  const handleRedirect = () => {
    router.push(`/library/${idCourse}`);
  };

  const currentStep = steps[step - 1];
  const isComplete = step === 4;

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {isComplete ? "Terminé !" : "Génération en cours..."}
            </div>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">
            {isComplete ? "🎉 Génération terminée !" : "Génération..."}
          </h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl">
            {isComplete
              ? "Votre cours a été généré avec succès ! Cliquez ci-dessous pour l'explorer."
              : "Notre IA analyse vos documents et génère votre cours personnalisé."}
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Progress Card */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm max-w-4xl mx-auto w-full">
        <CardContent className="p-8">
          {isComplete ? (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Cours généré avec succès !
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre cours personnalisé est prêt. Vous pouvez maintenant
                  commencer à apprendre !
                </p>
              </div>
              <Button
                onClick={handleRedirect}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Voir mon cours
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            /* Loading State */
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Progression</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              {currentStep && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <currentStep.icon className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {currentStep.title}
                    </h3>
                    <p className="text-gray-600">{currentStep.description}</p>
                  </div>
                </div>
              )}

              {/* Steps Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((stepItem, index) => {
                  const isActive = step === stepItem.id;
                  const isCompleted = step > stepItem.id;
                  const isPending = step < stepItem.id;

                  return (
                    <div
                      key={stepItem.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? "bg-blue-50 border-blue-200 shadow-md"
                          : isCompleted
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <stepItem.icon
                              className={`w-5 h-5 ${
                                isActive ? "animate-pulse" : ""
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              isActive
                                ? "text-blue-600"
                                : isCompleted
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {stepItem.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading Message */}
              <div className="text-center text-gray-500 text-sm">
                <p>
                  Veuillez patienter pendant que nous créons votre cours
                  personnalisé...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
