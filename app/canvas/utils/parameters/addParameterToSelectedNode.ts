import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getSelectedNode } from '@/canvas/utils/nodes/getSelectedNode';

export const addParameterToSelectedNode = (parameterId: string) => {
    const state = useCanvasStore.getState();

    const items = state.items;
    const setItems = state.setItems;
    const parameters = state.parameters;

    const node = getSelectedNode();
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;

    const parameterExists = node.parameters.some((parameter) => parameter.id === parameterId);
    if (parameterExists) return;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: [...item.parameters, { ...parameter }],
            };
        }
        return item;
    });

    setItems(updatedItems);
};
