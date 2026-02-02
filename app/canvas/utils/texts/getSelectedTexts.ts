import type { CanvasItem, Text } from '@/canvas/_core/_/canvas.types';
import { getTexts } from '@/canvas/utils/texts/getTexts';

export const getSelectedTexts = (items: CanvasItem[], selectedIds: string[]): Text[] =>
    getTexts(items).filter((text) => selectedIds.includes(text.id));
