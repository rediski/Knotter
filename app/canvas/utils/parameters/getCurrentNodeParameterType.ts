import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { ParameterType } from '@/canvas/_core/_/parameter';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

export const getCurrentNodeParameterType = (): ParameterType | null => {
    const state = useCanvasStore.getState();
    const selectedItem = state.selectedItem;
    const items = state.items;
    const parameters = state.parameters;

    if (selectedItem?.kind !== 'node') return null;

    const nodes = getNodes(items);
    const node = nodes.find((node) => node.id === selectedItem.id);

    if (!node) return null;

    const firstParameterId = node.parameters[0].id;
    const fullParameter = parameters.find((p) => p.id === firstParameterId);

    return fullParameter?.type || null;
};
