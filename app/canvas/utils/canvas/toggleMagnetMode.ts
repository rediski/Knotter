import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getSnappedPosition } from '@/canvas/utils/items/getSnappedPosition';

interface SnapSelectedNodesOptions {
    items: CanvasItem[];
    selectedItemIds: string[];
}

const snapSelectedNodes = ({ items, selectedItemIds }: SnapSelectedNodesOptions): CanvasItem[] => {
    return items.map((item) => {
        if (item.kind !== 'node' || !selectedItemIds.includes(item.id)) {
            return item;
        }

        const newPosition = getSnappedPosition();

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

    useItemsStore.setState({
        items: newMagnet
            ? snapSelectedNodes({
                  items: itemsState.items,
                  selectedItemIds: itemsState.selectedItemIds,
              })
            : itemsState.items,
    });
}
