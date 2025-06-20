import { LevelBadge } from "@/components/badge/LevelBadge";
import { OwnerBadge } from "@/components/badge/OwnerBadge";
import { SubjectBadge } from "@/components/badge/SubjectBadge";
import { Button } from "@/components/ui/button";
import {
  BicepsFlexed,
  CircleStop,
  Heart,
  Settings,
  BookOpen,
} from "lucide-react";

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
  const course = courseData as any;

  return (
    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 sm:p-6 lg:p-8 text-white shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-bl from-white/30 to-transparent rounded-full -translate-y-8 sm:-translate-y-16 lg:-translate-y-24 translate-x-8 sm:translate-x-16 lg:translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-8 sm:translate-y-16 lg:translate-y-24 -translate-x-8 sm:-translate-x-16 lg:-translate-x-24"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          {/* Course Info */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-white/80 mb-1">Cours</p>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight break-words">
                {course?.title || "OUIIII"}
              </h1>
            </div>
          </div>

          {/* Action Buttons - All on same line */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <Button
              onClick={() => {
                if (selectedTab === "quiz") {
                  setSelectedTab("overview");
                } else {
                  setSelectedTab("quiz");
                }
              }}
              className="flex-1 sm:flex-none h-10 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
            >
              {selectedTab === "quiz" ? (
                <>
                  <CircleStop className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Arrêter le quiz</span>
                  <span className="sm:hidden">Arrêter</span>
                </>
              ) : (
                <>
                  <BicepsFlexed className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Lancer un quiz</span>
                  <span className="sm:hidden">Quiz</span>
                </>
              )}
            </Button>

            <Button
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Badges - Responsive Grid */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <SubjectBadge text={(course?.subject as string) || "Matière"} />
          <LevelBadge text={(course?.level as string) || "Niveau"} />
          <OwnerBadge owner={"TristanH"} />
        </div>
      </div>

      {/* Decorative elements - Hide on very small screens */}
      <div className="absolute inset-0 overflow-hidden opacity-10 hidden sm:block">
        <div className="absolute -top-4 -right-4 w-24 h-24 lg:w-32 lg:h-32 border border-white/30 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 lg:w-20 lg:h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 lg:w-3 lg:h-3 bg-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};
