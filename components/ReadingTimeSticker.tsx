import { StickerBadge, StickerBadgeProps } from "./sticker-badge";

interface ReadingTimeStickerProps extends Partial<StickerBadgeProps> {
  readingTime?: number;
}

export default function ReadingTimeSticker({
  readingTime,
  ...rest
}: ReadingTimeStickerProps) {
  return (
    <StickerBadge {...rest}>
      {readingTime ? `${readingTime} דקות קריאה` : "קריאה קצרה"}
    </StickerBadge>
  );
}
