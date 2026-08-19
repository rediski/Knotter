import { updateParameter } from '@/utils/parameters/updateParameter';

export const changeParameterDescription = (parameterId: string, newDescription: string) => {
    updateParameter(parameterId, { description: newDescription });
};
