import { getEdges } from '@/canvas/utils/edges/getEdges';

import { CanvasItem, Edge } from '@/canvas/_core/_/canvas.types';

export const getSelectedEdges = (items: CanvasItem[], selectedIds: string[]): Edge[] =>
    getEdges(items).filter((edge) => selectedIds.includes(edge.from) && selectedIds.includes(edge.to));
