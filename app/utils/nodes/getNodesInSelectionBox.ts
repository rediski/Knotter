import type { Node, Position } from '@/_core/_/canvas.types';

export function getNodesInSelectionBox(nodes: Node[], selectionStart: Position, selectionEnd: Position): string[] {
    const left = Math.min(selectionStart.x, selectionEnd.x);
    const right = Math.max(selectionStart.x, selectionEnd.x);
    const top = Math.min(selectionStart.y, selectionEnd.y);
    const bottom = Math.max(selectionStart.y, selectionEnd.y);

    const bounds = { left, right, top, bottom };

    return nodes
        .filter((node) => {
            const { x, y } = node.position;

            const insideX = x >= bounds.left && x <= bounds.right;
            const insideY = y >= bounds.top && y <= bounds.bottom;

            return insideX && insideY;
        })
        .map((node) => node.id);
}
