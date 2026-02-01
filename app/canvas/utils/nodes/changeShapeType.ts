import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { ShapeType } from '@/canvas/_core/_/shapeType.type';

export function changeShapeType(newShape: ShapeType) {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const updatedItems = items.map((item) =>
        item.kind === 'node' && selectedItemIds.includes(item.id) ? { ...item, shapeType: newShape } : item,
    );

    setItems(updatedItems);
}
