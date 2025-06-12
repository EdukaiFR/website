import { LevelBadge } from "@/components/badge/LevelBadge";
import { OwnerBadge } from "@/components/badge/OwnerBadge";
import { SubjectBadge } from "@/components/badge/SubjectBadge";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, CircleStop, Heart, Settings, BookOpen } from "lucide-react";

export type HeaderProps = {
  courseData: unknown;
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
};

export const Header = ({
  courseData,
  setSelectedTab,
  selectedTab,
}: HeaderProps) => {
  const course = courseData as Record<string, unknown>;
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="relative z-10">
        {/* Header Content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                Cours
              </div>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
              {(course.title as string) || "Cours sans titre"}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={() => {
                if (selectedTab === "quiz") {
                  setSelectedTab("overview");
                } else {
                  setSelectedTab("quiz");
                }
              }}
              className="h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {selectedTab === "quiz" ? (
                <>
                  <CircleStop className="w-5 h-5 mr-2" />
                  Arrêter le quiz
                </>
              ) : (
                <>
                  <BicepsFlexed className="w-5 h-5 mr-2" />
                  Lancer un quiz
                </>
              )}
            </Button>

            <Button
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Heart className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              className="h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <SubjectBadge text={(course.subject as string) || "Matière"} />
          <LevelBadge text={(course.level as string) || "Niveau"} />
          <OwnerBadge owner={"TristanH"} />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
    </div>
  );
};
