import { useItemsStore } from '@/store/useItemsStore';

export const deleteSelectedParameters = () => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const selectedParameterIds = itemsState.selectedParameterIds;
    const setParameters = itemsState.setParameters;
    const setSelectedParameterIds = itemsState.setSelectedParameterIds;

    if (selectedParameterIds.length === 0) return;

    const idsToDelete = new Set(selectedParameterIds);
    const newParameters = parameters.filter((p) => !idsToDelete.has(p.id));

    setParameters(newParameters);
    setSelectedParameterIds([]);
};
