import { Parameter } from '@/_core/_/parameter';
import { updateSelection } from '@/utils/items/updateSelection';
import { useItemsStore } from '@/store/useItemsStore';

export interface SelectParametersEvent {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export const selectParameters = (id: string, event: SelectParametersEvent, parameters: Parameter[]) => {
    const { ctrlKey, metaKey, shiftKey } = event;

    const selectedParameterIds = useItemsStore.getState().selectedParameterIds;
    const setSelectedParameterIds = useItemsStore.getState().setSelectedParameterIds;

    const newSelection = updateSelection({
        items: parameters,
        selectedIds: selectedParameterIds,
        targetId: id,
        getItemId: (parameter) => parameter.id,
        shiftKey,
        ctrlKey,
        metaKey,
    });

    setSelectedParameterIds(newSelection);
};
