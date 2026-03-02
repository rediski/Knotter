import { getEdges } from '@/canvas/utils/edges/getEdges';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectAllEdges() {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setSelectedEdgeIds = itemsState.setSelectedEdgeIds;

    const edges = getEdges(items);
    setSelectedEdgeIds(edges.map((edge) => edge.id));
}
