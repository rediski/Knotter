import type { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';
import { v4 as uuid } from 'uuid';

export const createParameter = (name: string): Parameter => {
    const itemsState = useItemsStore.getState();

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type: null,
        value: null,
        defaultValue: null,
        parentId: null,
    };

    itemsState.setParameters([...itemsState.parameters, newParameter]);

    return newParameter;
};
