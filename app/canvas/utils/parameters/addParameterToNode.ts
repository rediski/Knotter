import { useItemsStore } from '@/canvas/store/useItemsStore';
import { Node } from '@/canvas/_core/_/canvas.types';

export const addParameterToNode = (nodeId: string, parameterId: string) => {
    const { items, parameters, setItems } = useItemsStore.getState();

    const node = items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;

    const parameterExists = node.parameters?.some((parameter) => parameter.id === parameterId);
    if (parameterExists) return;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return {
                ...item,
                parameters: [...(item.parameters || []), { ...parameter }],
            };
        }
        return item;
    });

    setItems(updatedItems);
};
