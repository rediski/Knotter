import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';
import { v4 as uuid } from 'uuid';

interface AddParameterToStructureProps {
    parameter: Parameter | undefined;
    name: string;
    type: Parameter['type'];
}

export const addParameterToStructure = ({ parameter, name, type }: AddParameterToStructureProps) => {
    if (!parameter) return;
    if (!isStructure(parameter)) return;

    const newParam: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
    } as Parameter;

    updateParameter(parameter.id, {
        ...parameter,
        data: [...parameter.data, newParam],
    });
};
