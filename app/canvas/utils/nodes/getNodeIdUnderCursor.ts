import type { Position } from '@/canvas/canvas.types';

export function getNodeIdUnderCursor(pos: Position): string | null {
    const el = document.elementFromPoint(pos.x, pos.y);

    if (!el) return null;

    const nodeEl = el.closest<HTMLElement>('[data-node-id]');

    return nodeEl?.dataset.nodeId ?? null;
}
