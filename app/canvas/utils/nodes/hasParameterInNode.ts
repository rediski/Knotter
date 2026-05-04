import { getNodeById } from '@/canvas/utils/nodes/getNodeById';

export const hasParameterInNode = (parameterId: string, nodeId: string): boolean => {
    const node = getNodeById(nodeId);

    if (!node) return false;

    const hasParameterInNode = node.parameters.some((parameter) => parameter.id === parameterId);

    return hasParameterInNode;
};
