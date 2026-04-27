import { getOpenedNode } from '@/canvas/utils/nodes/getOpenedNode';

export const hasParameterInNode = (parameterId: string): boolean => {
    const openedNode = getOpenedNode();
    if (!openedNode) return false;

    const hasParameterInNode = openedNode.parameters.some((parameter) => parameter.id === parameterId);

    return hasParameterInNode;
};
