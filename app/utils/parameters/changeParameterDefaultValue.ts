import type { ParameterValue } from '@/_core/_/parameter';
import { updateParameter } from '@/utils/parameters/updateParameter';

export const changeParameterDefaultValue = (parameterId: string, newDefaultValue: ParameterValue) => {
    updateParameter(parameterId, { defaultValue: newDefaultValue });
};
