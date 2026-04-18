import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { v4 as uuid } from 'uuid';

interface AddParameterToStructureProps {
    parameter: Parameter | undefined;
    name: string;
    type: Parameter['type'];
}

export const addParameterToStructure = ({ parameter, name, type }: AddParameterToStructureProps) => {
    if (!parameter) return;
    if (!isStructure(parameter)) return;

    const itemsState = useItemsStore.getState();

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
        parentId: parameter.id,
    } as Parameter;

    itemsState.setParameters([...itemsState.parameters, newParameter]);

    updateParameter(parameter.id, {
        ...parameter,
        data: [...parameter.data, newParameter.id],
    });
};
