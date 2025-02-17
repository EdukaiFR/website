import { LevelBadge } from "@/components/badge/LevelBadge";
import { OwnerBadge } from "@/components/badge/OwnerBadge";
import { SubjectBadge } from "@/components/badge/SubjectBadge";
import { Button } from "@/components/ui/button";
import { CourseData, Quiz } from "@/hooks";
import { BicepsFlexed, Heart, Settings } from "lucide-react";

export type HeaderProps = {
  courseData: CourseData;
  quizData: Quiz;
};

export const Header = ({ courseData, quizData }: HeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[#1A202C] text-[28px] font-semibold">
          {courseData.title}
        </h1>
        {/* CTA */}
        <div className="flex items-center justify-end gap-4">
          <Button className="transition-all bg-gradient-to-tr from-[#2D6BCF] to-[#3678FF] text-white py-2 px-4 rounded-lg hover:opacity-80">
            <BicepsFlexed size={16} className="mr-4" />
            Lancer un quiz
          </Button>

          <Button
            size={"icon"}
            className="transition-all rounded-lg bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/80 px-4 py-2"
          >
            <Heart size={16} />
          </Button>

          <Button
            size={"icon"}
            className="transition-all rounded-lg bg-white border border-[#E3E3E7] text-[#343A40] px-4 py-2 hover:bg-[#E3E3E7]/10"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-start gap-3">
        <SubjectBadge text={courseData.subject} />
        <LevelBadge text={courseData.level} />
        <OwnerBadge owner={"TristanH"} />
      </div>
    </div>
  );
};
