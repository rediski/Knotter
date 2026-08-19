import { updateParameter } from '@/utils/parameters/updateParameter';

export const changeParameterName = (parameterId: string, newName: string) => {
    updateParameter(parameterId, { name: newName });
};
