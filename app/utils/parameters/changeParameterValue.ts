import type { ParameterValue } from '@/_core/_/parameter';
import { updateParameter } from '@/utils/parameters/updateParameter';

export const changeParameterValue = (parameterId: string, newValue: ParameterValue) => {
    updateParameter(parameterId, { value: newValue });
};
