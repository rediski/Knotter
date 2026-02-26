import type { Parameter } from '@/canvas/_core/_/parameter';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
    const state = useCanvasStore.getState();

    const parameters = state.parameters;
    const setParameters = state.setParameters;

    setParameters(
        parameters.map((parameter) =>
            parameter.id === parameterId ? ({ ...parameter, ...updates } as Parameter) : parameter,
        ),
    );
};
