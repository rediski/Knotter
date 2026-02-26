import { useCanvasStore } from '@/canvas/store/canvasStore';

export const removeParameter = (parameterId: string) => {
    const state = useCanvasStore.getState();

    const parameters = state.parameters;
    const setParameters = state.setParameters;

    setParameters(parameters.filter((parameter) => parameter.id !== parameterId));
};
