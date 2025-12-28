import type { CanvasItem, TextElement } from '@/canvas/canvas.types';
import { getTexts } from '@/canvas/utils/texts/getTexts';

export const getSelectedTexts = (items: CanvasItem[], selectedIds: string[]): TextElement[] =>
    getTexts(items).filter((text) => selectedIds.includes(text.id));
