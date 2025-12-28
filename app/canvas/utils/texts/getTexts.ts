import type { CanvasItem, TextElement } from '@/canvas/canvas.types';

export const getTexts = (items: CanvasItem[]): TextElement[] => items.filter((i): i is TextElement => i.kind === 'text');
