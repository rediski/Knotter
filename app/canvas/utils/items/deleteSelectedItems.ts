import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getTexts } from '@/canvas/utils/texts/getTexts';

export function deleteSelectedItems() {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const nodes = getNodes(items);
    const edges = getEdges(items);
    const texts = getTexts(items);

    const toDeleteNodes = new Set(nodes.filter((node) => selectedItemIds.includes(node.id)).map((node) => node.id));
    const toDeleteEdges = new Set(edges.filter((edge) => selectedItemIds.includes(edge.id)).map((edge) => edge.id));
    const toDeleteTexts = new Set(texts.filter((text) => selectedItemIds.includes(text.id)).map((text) => text.id));

    const newItems = items.filter((item) => {
        if (item.kind === 'node') {
            return !toDeleteNodes.has(item.id);
        }

        if (item.kind === 'edge') {
            return !toDeleteEdges.has(item.id) && !toDeleteNodes.has(item.from) && !toDeleteNodes.has(item.to);
        }

        if (item.kind === 'text') {
            return !toDeleteTexts.has(item.id);
        }

        return true;
    });

    setItems(newItems);
}
