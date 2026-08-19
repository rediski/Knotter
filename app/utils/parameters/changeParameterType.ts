import type { ParameterType } from '@/_core/_/parameter';
import { updateParameter } from '@/utils/parameters/updateParameter';

export const changeParameterType = (parameterId: string, newType: ParameterType | null) => {
    updateParameter(parameterId, {
        type: newType,
        value: null,
        defaultValue: null,
    });
};
