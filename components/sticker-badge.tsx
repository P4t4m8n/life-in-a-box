import type { ReactNode } from "react";

export interface StickerBadgeProps {
  children: ReactNode;
  tone?: "leaf" | "light" | "coral";
  className?: string;
  rotation?: number;
  rotationDirection?: "clockwise" | "counterclockwise";
};

const toneClasses: Record<string, string> = {
  leaf: "border-[var(--leaf)] bg-[var(--surface)] text-[var(--leaf)]",
  light: "border-white/70 bg-white/10 text-[#cce6d3]",
  coral:
    "border-[var(--coral-strong)] bg-[var(--surface)] text-[var(--coral-strong)]",
};

// Small rotated pill styled like a hand-stuck sticker label.
export function StickerBadge({
  children,
  tone = "leaf",
  className = "",
  rotation = -2,
  rotationDirection = "counterclockwise",
}: StickerBadgeProps) {
  return (
    <span
      className={`inline-block w-fit rounded-full border-2 border-dashed px-3 py-1 text-xs font-extrabold whitespace-nowrap ${toneClasses[tone]} ${className}`}
      style={{ transform: `rotate(${rotation * (rotationDirection === "clockwise" ? 1 : -1)}deg)` }}
    >
      {children}
    </span>
  );
}
