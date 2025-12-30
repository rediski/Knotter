import { NODE_MOVE_MAX_STEP } from '@/canvas/canvas.constants';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function toggleMagnetMode() {
    useCanvasStore.setState((state) => {
        const newMagnet = !state.isMagnet;

        let updatedItems = state.items;

        if (newMagnet) {
            updatedItems = state.items.map((item) => {
                if (item.kind !== 'node') return item;
                if (!state.selectedItemIds.includes(item.id)) return item;

                const newX = Math.round(item.position.x / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP;
                const newY = Math.round(item.position.y / NODE_MOVE_MAX_STEP) * NODE_MOVE_MAX_STEP;

                if (newX === item.position.x && newY === item.position.y) return item;

                return {
                    ...item,
                    position: { x: newX, y: newY },
                };
            });
        }

        return {
            isMagnet: newMagnet,
            items: updatedItems,
        };
    });
}
