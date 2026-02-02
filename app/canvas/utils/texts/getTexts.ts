import type { CanvasItem, Text } from '@/canvas/_core/_/canvas.types';

export const getTexts = (items: CanvasItem[]): Text[] => items.filter((i): i is Text => i.kind === 'text');
