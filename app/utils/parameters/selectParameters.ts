import { Parameter } from '@/_core/_/parameter';
import { updateSelection } from '@/utils/items/updateSelection';
import { useItemsStore } from '@/store/useItemsStore';

export interface SelectParametersEvent {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export const selectParameters = (id: string, event: SelectParametersEvent, filteredParameters: Parameter[]) => {
    const { ctrlKey, metaKey, shiftKey } = event;

    const selectedParameterIds = useItemsStore.getState().selectedParameterIds;
    const setSelectedParameterIds = useItemsStore.getState().setSelectedParameterIds;

    const newSelection = updateSelection({
        items: filteredParameters,
        selectedIds: selectedParameterIds,
        targetId: id,
        getItemId: (p) => p.id,
        shiftKey,
        ctrlKey,
        metaKey,
    });

    setSelectedParameterIds(newSelection);
};
