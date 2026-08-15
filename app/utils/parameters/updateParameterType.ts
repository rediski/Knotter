import type { ParameterType } from '@/_core/_/parameter';
import { updateParameter } from '@/utils/parameters/updateParameter';

export const updateParameterType = (parameterId: string, newType: Exclude<ParameterType, null>) => {
    updateParameter(parameterId, {
        type: newType,
    });
};
