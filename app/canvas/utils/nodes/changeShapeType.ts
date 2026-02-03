import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { ShapeType } from '@/canvas/_core/_/shapeType.type';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function changeShapeType(newShape: ShapeType) {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const nodes = getNodes(items);

    const updatedNodes = nodes.map((node) => (selectedItemIds.includes(node.id) ? { ...node, shapeType: newShape } : node));

    setItems(updatedNodes);
}
