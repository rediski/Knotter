import type { Parameter } from '@/canvas/_core/_/parameter';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    setParameters(
        parameters.map((parameter) =>
            parameter.id === parameterId ? ({ ...parameter, ...updates } as Parameter) : parameter,
        ),
    );
};
