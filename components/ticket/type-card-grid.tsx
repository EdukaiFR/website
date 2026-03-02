"use client";

import type { TicketConfigValue } from "@/lib/types/ticket";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import {
  Bug,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Settings,
  ShieldAlert,
  Sparkles,
  Wrench,
  Zap,
  AlertTriangle,
  FileText,
  Globe,
  Lock,
  RefreshCw,
} from "lucide-react";

interface TypeConfig {
  icon: LucideIcon;
  label: string;
  description: string;
  color: {
    bg: string;
    bgSelected: string;
    icon: string;
    border: string;
    text: string;
    textSelected: string;
    descSelected: string;
  };
}

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  anomaly: {
    icon: AlertTriangle,
    label: "Anomalie",
    description: "Problème système ou interruption",
    color: {
      bg: "bg-amber-50",
      bgSelected: "bg-amber-50",
      icon: "text-amber-600",
      border: "border-amber-500",
      text: "text-amber-700",
      textSelected: "text-amber-800",
      descSelected: "text-amber-600",
    },
  },
  bug: {
    icon: Bug,
    label: "Bug",
    description: "Fonctionnalité cassée ou comportement inattendu",
    color: {
      bg: "bg-red-50",
      bgSelected: "bg-red-50",
      icon: "text-red-600",
      border: "border-red-500",
      text: "text-red-700",
      textSelected: "text-red-800",
      descSelected: "text-red-500",
    },
  },
  feature_request: {
    icon: Lightbulb,
    label: "Nouvelle fonctionnalité",
    description: "Suggestion d'amélioration ou de nouveauté",
    color: {
      bg: "bg-violet-50",
      bgSelected: "bg-violet-50",
      icon: "text-violet-600",
      border: "border-violet-500",
      text: "text-violet-700",
      textSelected: "text-violet-800",
      descSelected: "text-violet-500",
    },
  },
  question: {
    icon: HelpCircle,
    label: "Question",
    description: "Besoin d'aide ou d'information",
    color: {
      bg: "bg-blue-50",
      bgSelected: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-500",
      text: "text-blue-700",
      textSelected: "text-blue-800",
      descSelected: "text-blue-500",
    },
  },
  improvement: {
    icon: Sparkles,
    label: "Amélioration",
    description: "Suggestion d'amélioration existante",
    color: {
      bg: "bg-emerald-50",
      bgSelected: "bg-emerald-50",
      icon: "text-emerald-600",
      border: "border-emerald-500",
      text: "text-emerald-700",
      textSelected: "text-emerald-800",
      descSelected: "text-emerald-500",
    },
  },
};

const DEFAULT_COLOR: TypeConfig["color"] = {
  bg: "bg-gray-50",
  bgSelected: "bg-gray-50",
  icon: "text-gray-600",
  border: "border-gray-400",
  text: "text-gray-700",
  textSelected: "text-gray-800",
  descSelected: "text-gray-500",
};

const ICON_MAP: Record<string, LucideIcon> = {
  bug: Bug,
  help_circle: HelpCircle,
  lightbulb: Lightbulb,
  message_square: MessageSquare,
  settings: Settings,
  shield_alert: ShieldAlert,
  sparkles: Sparkles,
  wrench: Wrench,
  zap: Zap,
  alert_triangle: AlertTriangle,
  file_text: FileText,
  globe: Globe,
  lock: Lock,
  refresh_cw: RefreshCw,
};

const SKELETON_COUNT = 3;

function resolveTypeConfig(type: TicketConfigValue): {
  Icon: LucideIcon;
  label: string;
  description: string;
  color: TypeConfig["color"];
} {
  const config = TYPE_CONFIGS[type.key];

  if (config) {
    const Icon = type.icon
      ? (ICON_MAP[type.icon] ?? config.icon)
      : config.icon;
    return {
      Icon,
      label: config.label,
      description: config.description,
      color: config.color,
    };
  }

  const Icon = type.icon ? (ICON_MAP[type.icon] ?? HelpCircle) : HelpCircle;
  return {
    Icon,
    label: type.label,
    description: "",
    color: DEFAULT_COLOR,
  };
}

interface TypeCardGridProps {
  types: TicketConfigValue[];
  selectedType: string;
  onSelect: (key: string) => void;
  isLoading?: boolean;
}

/**
 * Render a grid of selectable cards for ticket type selection.
 * Each card shows a colored icon on top, with title and description below.
 *
 * @param types - Available ticket types from config
 * @param selectedType - Currently selected type key
 * @param onSelect - Callback when a type is selected
 * @param isLoading - Show skeleton placeholders while loading
 */
export function TypeCardGrid({
  types,
  selectedType,
  onSelect,
  isLoading = false,
}: TypeCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-[128px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {types.map((type) => {
        const { Icon, label, description, color } = resolveTypeConfig(type);
        const isSelected = selectedType === type.key;

        return (
          <button
            key={type.key}
            type="button"
            onClick={() => onSelect(type.key)}
            className={`h-[128px] p-4 rounded-xl text-left transition-all duration-200 ${
              isSelected
                ? `border-2 ${color.border} ${color.bgSelected}`
                : "border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Icon
              className={`h-6 w-6 mb-2 ${
                isSelected ? color.icon : "text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isSelected ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {label}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
