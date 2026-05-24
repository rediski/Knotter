import type { CanvasItem } from '@/_core/_/canvas.types';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useItemsStore } from '@/store/useItemsStore';
import { snapPosition } from '@/utils/items/getSnappedPosition';
import { NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';

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
    const { currentSceneId, scenes } = useItemsStore.getState();

    const newMagnet = !canvasState.isMagnet;

    useCanvasStore.setState({
        isMagnet: newMagnet,
    });

    if (newMagnet && currentSceneId) {
        const scene = scenes[currentSceneId];
        const items = scene?.items ?? [];
        const selectedItemIds = useItemsStore.getState().selectedItemIds;

        const snappedItems = snapSelectedNodes({
            items,
            selectedItemIds,
        });

        if (scene) {
            const updatedScene = {
                ...scene,
                items: snappedItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
    }
}
