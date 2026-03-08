import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { snapPosition } from '@/canvas/utils/items/getSnappedPosition';
import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

interface SnapSelectedNodesOptions {
    items: CanvasItem[];
    selectedItemIds: string[];
}

const snapSelectedNodes = ({ items, selectedItemIds }: SnapSelectedNodesOptions): CanvasItem[] => {
    return items.map((item) => {
        if (item.kind !== 'node' || !selectedItemIds.includes(item.id)) {
            return item;
        }

        const newPosition = snapPosition(item.position, NODE_MOVE_MAX_STEP);

        return newPosition.x === item.position.x && newPosition.y === item.position.y
            ? item
            : { ...item, position: newPosition };
    });
};

export function toggleMagnetMode() {
    const canvasState = useCanvasStore.getState();
    const itemsState = useItemsStore.getState();

    const newMagnet = !canvasState.isMagnet;

    useCanvasStore.setState({
        isMagnet: newMagnet,
    });

    if (newMagnet) {
        useItemsStore.setState({
            items: snapSelectedNodes({
                items: itemsState.items,
                selectedItemIds: itemsState.selectedItemIds,
            }),
        });
    }
}
