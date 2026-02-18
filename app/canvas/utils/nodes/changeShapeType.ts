import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { ShapeType } from '@/canvas/_core/_/shapeType.type';

export function changeShapeType(newShape: ShapeType) {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && selectedItemIds.includes(item.id)) {
            return { ...item, shapeType: newShape };
        }

        return item;
    });

    setItems(updatedItems);
}
