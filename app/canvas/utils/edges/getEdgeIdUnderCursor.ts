import type { Position } from '@/canvas/_core/_/canvas.types';

export function getEdgeIdUnderCursor(pos: Position): string | null {
    const el = document.elementFromPoint(pos.x, pos.y);

    if (!el) return null;

    const edgeEl = el.closest<HTMLElement>('[data-edge-id]');

    return edgeEl?.dataset.edgeId ?? null;
}
