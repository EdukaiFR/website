export type CounterBadgeProps = {
  counter: number;
  type?: string;
  size?: "xs" | "sm" | "md" | "lg";
};

export const CounterBadge = ({
  counter,
  type,
  size = "sm",
}: CounterBadgeProps) => {
  // Définition des classes de taille
  const sizeClasses = {
    xs: "text-xs px-2 py-0.5",
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-1.5",
    lg: "text-lg px-5 py-2",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-blue-600/20 text-blue-600 font-medium gap-1 ${sizeClasses[size]} border border-blue-200/60 backdrop-blur-sm`}
    >
      <p>{counter}</p>
      {type && <p>{type}</p>}
    </div>
  );
};
