import { useCanvasStore } from '@/canvas/store/canvasStore';

export const getFilteredParameters = ({ panelId }: { panelId?: string }) => {
    const state = useCanvasStore.getState();
    const parameters = state.parameters;

    let filterText = '';

    if (panelId) {
        filterText = state.filterText[panelId];
    }

    if (!filterText) {
        return parameters;
    }

    const searchText = filterText.toLowerCase();

    const filteredParameters = parameters.filter((parameter) => {
        return parameter.name.toLowerCase().includes(searchText) || parameter.type.toLowerCase().includes(searchText);
    });

    return filteredParameters;
};
