import type { Position } from '@/canvas/canvas.types';

export function getTextIdUnderCursor(pos: Position): string | null {
    const el = document.elementFromPoint(pos.x, pos.y);

    if (!el) return null;

    const textEl = el.closest<HTMLElement>('[data-text-id]');

    return textEl?.dataset.textId ?? null;
}
