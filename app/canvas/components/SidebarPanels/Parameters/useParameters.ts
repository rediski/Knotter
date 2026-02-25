import { useState } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import type { ParameterType, Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import type { Node } from '@/canvas/_core/_/canvas.types';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { v4 as uuid } from 'uuid';

function parameterInitialValue(type: ParameterType): Parameter['data'] {
    switch (type) {
        case 'number': {
            const numberConfig: ParameterTypeMap['number'] = {
                value: 0,
                min: undefined,
                max: undefined,
            };

            return numberConfig;
        }

        case 'string': {
            return '' as ParameterTypeMap['string'];
        }

        case 'boolean': {
            return false as ParameterTypeMap['boolean'];
        }

        case 'enum': {
            const enumConfig: ParameterTypeMap['enum'] = {
                value: null,
                options: [],
            };

            return enumConfig;
        }

        case 'structure': {
            return [] as ParameterTypeMap['structure'];
        }
    }
}

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
            data: parameterInitialValue(type),
        } as Parameter;

        setParameters([...parameters, newParameter]);
        setParameterName('');

        return newParameter;
    };

    const removeParameter = (parameterId: string) => {
        setParameters(parameters.filter((parameter) => parameter.id !== parameterId));
    };

    const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
        setParameters(
            parameters.map((parameter) =>
                parameter.id === parameterId ? ({ ...parameter, ...updates } as Parameter) : parameter,
            ),
        );
    };

    const addParameterToNode = (nodeId: string, parameterId: string) => {
        const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
        const parameter = parameters.find((parameter) => parameter.id === parameterId);
        const node = items[nodeIndex] as Node;
        const parameterExists = node.parameters.some((parameter) => parameter.id === parameterId);

        if (!parameter) return;
        if (nodeIndex === -1) return;
        if (parameterExists) return;

        const nodeParameter: Parameter = {
            ...parameter,
        };

        const updatedNode = {
            ...node,
            parameters: [...node.parameters, nodeParameter],
        };

        const updatedItems = [...items];
        updatedItems[nodeIndex] = updatedNode;
        setItems(updatedItems);
    };

    const getNodeParameters = (nodeId: string) => {
        const node = nodes.find((node) => node.id === nodeId);

        if (!node) return null;

        return node.parameters;
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
