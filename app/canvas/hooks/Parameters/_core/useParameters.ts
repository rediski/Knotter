import { useState } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import type { Parameter, ParameterType } from '@/canvas/utils/parameters/parameter.types';
import type { Node } from '@/canvas/canvas.types';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { createInitialParameterValue } from '@/canvas/utils/parameters/parameter.utils';

import { v4 as uuid } from 'uuid';

export const useParameters = () => {
    const [parameterName, setParameterName] = useState('');
    const [parameterType, setParameterType] = useState<ParameterType>('number');

    const items = useCanvasStore((state) => state.items);
    const parameters = useCanvasStore((state) => state.parameters);
    const setItems = useCanvasStore((state) => state.setItems);
    const setParameters = useCanvasStore((state) => state.setParameters);

    const nodes = getNodes(items);

    const createParameter = (name: string, type: ParameterType): Parameter => {
        const newParameter: Parameter = {
            id: uuid(),
            name: name,
            type,
            value: createInitialParameterValue(type),
        };

        setParameters([...parameters, newParameter]);
        setParameterName('');

        return newParameter;
    };

    const removeParameter = (parameterId: string) => {
        setParameters(parameters.filter((parameter) => parameter.id !== parameterId));
    };

    const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
        setParameters(
            parameters.map((parameter) => (parameter.id === parameterId ? { ...parameter, ...updates } : parameter)),
        );
    };

    const addParameterToNode = (nodeId: string, parameterId: string) => {
        const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
        const parameter = parameters.find((parameter) => parameter.id === parameterId);
        const node = items[nodeIndex] as Node;
        const parameterExists = node.nodeParameters.some((parameter) => parameter.id === parameterId);

        if (!parameter) return;
        if (nodeIndex === -1) return;
        if (parameterExists) return;

        const nodeParameter: Parameter = {
            ...parameter,
        };

        const updatedNode = {
            ...node,
            nodeParameters: [...node.nodeParameters, nodeParameter],
        };

        const updatedItems = [...items];
        updatedItems[nodeIndex] = updatedNode;
        setItems(updatedItems);
    };

    const getNodeParameters = (nodeId: string) => {
        const node = nodes.find((node) => node.id === nodeId);

        if (!node) return null;

        return node.nodeParameters;
    };

    return {
        parameters,

        parameterName,
        parameterType,
        setParameterName,
        setParameterType,

        createParameter,
        removeParameter,
        updateParameter,

        addParameterToNode,
        getNodeParameters,
    };
};
