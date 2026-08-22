export default function AnimatedHamburger({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const lineClass = "transition-transform duration-300 ease-in-out";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="4"
        y1="5"
        x2="20"
        y2="5"
        className={lineClass}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: open ? "translateY(7px) rotate(45deg)" : undefined,
        }}
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        className={`transition-opacity duration-200 ease-in-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <line
        x1="4"
        y1="19"
        x2="20"
        y2="19"
        className={lineClass}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: open ? "translateY(-7px) rotate(-45deg)" : undefined,
        }}
      />
    </svg>
  );
}
