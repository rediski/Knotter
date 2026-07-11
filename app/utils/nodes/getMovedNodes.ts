import type { Node, Position } from '@/_core/_/canvas.types';

import { getSelectedNodes } from '@/utils/nodes/getSelectedNodes';

export function getMovedNodes(initialNodePositions: Map<string, Position>): Node[] {
    const selectedNodes = getSelectedNodes();

    return selectedNodes.filter((node) => {
        if (node.kind !== 'node') return false;

        const initialPos = initialNodePositions.get(node.id);

        return initialPos && (initialPos.x !== node.position.x || initialPos.y !== node.position.y);
    });
}
