import type { Parameter } from '@/canvas/_core/_/parameter';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { reorderArray } from '@/canvas/utils/canvas/reorderArray';
import { Node } from '@/canvas/_core/_/canvas.types';

interface ReorderParametersParams {
    draggedId: string;
    targetId: string;
    position: 'top' | 'bottom' | null;
}

export function reorderParameters({ draggedId, targetId, position }: ReorderParametersParams): void {
    const items = useItemsStore.getState().items;
    const selectedTabId = useCanvasStore.getState().selectedTabId;
    const node = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (node?.kind !== 'node') return;

    const currentNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;
    if (!currentNode) return;

    const nodeParameters = currentNode.parameters ?? [];
    const updatedParameters = reorderArray(nodeParameters, draggedId, targetId, position);

    if (updatedParameters === nodeParameters) return;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: updatedParameters as Parameter[],
            };
        }
        return item;
    });

    useItemsStore.getState().setItems(updatedItems);
}
