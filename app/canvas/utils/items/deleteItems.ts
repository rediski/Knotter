import { CanvasItem } from '@/canvas/canvas.types';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getTexts } from '@/canvas/utils/texts/getTexts';

export function deleteItems(items: CanvasItem[], selectedIds: string[]): CanvasItem[] {
    const nodes = getNodes(items);
    const edges = getEdges(items);
    const texts = getTexts(items);

    const toDeleteNodes = new Set(nodes.filter((n) => selectedIds.includes(n.id)).map((n) => n.id));
    const toDeleteEdges = new Set(edges.filter((e) => selectedIds.includes(e.id)).map((e) => e.id));
    const toDeleteTexts = new Set(texts.filter((t) => selectedIds.includes(t.id)).map((t) => t.id));

    return items.filter((item) => {
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
}
