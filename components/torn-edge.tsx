type TornEdgeProps = {
  edgeColor?: string;
  baseColor?: string;
  className?: string;
};

// Zigzag divider that mimics a torn sheet of paper between two stacked sections.
export function TornEdge({
  edgeColor = "var(--surface)",
  baseColor = "var(--ink)",
  className = "",
}: TornEdgeProps) {
  return (
    <div
      aria-hidden="true"
      className={`h-4 w-full ${className}`}
      style={{
        backgroundColor: baseColor,
        backgroundImage: `linear-gradient(135deg, ${edgeColor} 50%, transparent 50%), linear-gradient(45deg, ${edgeColor} 50%, transparent 50%)`,
        backgroundPosition: "top left, top right",
        backgroundSize: "18px 18px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}
