import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

interface RemoveStructureParameterProps {
    structure: Parameter | undefined;
    parameterId: string;
}

export const removeStructureParameter = ({ structure, parameterId }: RemoveStructureParameterProps) => {
    if (!structure) return;
    if (!isStructure(structure)) return;

    updateParameter(structure.id, {
        ...structure,
        data: structure.data.filter((p) => p.id !== parameterId),
    });
};
