import { Brain, CheckCircle, Target } from "lucide-react";

export type SkillsProps = {
    skills: string[];
};

export const Skills = (props: SkillsProps) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl">
                    <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                    Compétences
                </h3>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center gap-3 h-full text-center">
                <div className="p-3 bg-blue-50 rounded-2xl">
                    <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                        Les compétences seront bientôt disponibles.
                    </p>
                </div>
            </div>

            {/* Skills List */}
            <div className="flex flex-col gap-3 flex-1">
                {props.skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/50 hover:bg-blue-50/80 transition-all duration-200"
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {skill}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
