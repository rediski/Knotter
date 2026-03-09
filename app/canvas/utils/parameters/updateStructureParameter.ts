import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

interface UpdateStructureParameterProps {
    structure: Parameter | undefined;
    parameterId: string;
    updates: Partial<Parameter>;
}

export const updateStructureParameter = ({ structure, parameterId, updates }: UpdateStructureParameterProps) => {
    if (!structure) return;
    if (!isStructure(structure)) return;

    updateParameter(structure.id, {
        ...structure,
        data: structure.data.map((p) => (p.id === parameterId ? { ...p, ...updates } : p)),
    });
};
