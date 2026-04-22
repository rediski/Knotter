import type { Parameter, ParameterType, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { Node } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export const addParameterToNode = (nodeId: string, parameterId: string) => {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const parameters = itemsStore.parameters;

    const node = items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;

    const parameterExists = node.parameters?.some((param) => param.id === parameterId);

    if (parameterExists) return;

    let value: ParameterTypeMap[ParameterType];

    if (parameter.type === 'enum') {
        const enumValue = parameter.value as { selected: string | null; options: string[] };
        value = {
            selected: enumValue.options[0] || null,
            options: enumValue.options,
        };
    }

    if (parameter.type !== 'enum' && parameter.type !== 'structure') {
        const paramWithDefault = parameter as Parameter & { defaultValue: ParameterTypeMap[typeof parameter.type] };
        value = paramWithDefault.defaultValue;
    }

    if (parameter.type === 'structure') {
        value = parameter.value;
    }

    const nodeParameter: Parameter = {
        ...parameter,
        value: value!,
    };

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return {
                ...item,
                parameters: [...(item.parameters || []), nodeParameter],
            };
        }
        return item;
    });

    setItems(updatedItems);
};
