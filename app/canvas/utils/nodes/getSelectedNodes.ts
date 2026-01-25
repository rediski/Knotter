import { CanvasItem, Node } from '@/canvas/_core/_/canvas.types';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

export const getSelectedNodes = (items: CanvasItem[], selectedIds: string[]): Node[] =>
    getNodes(items).filter((node) => selectedIds.includes(node.id));
