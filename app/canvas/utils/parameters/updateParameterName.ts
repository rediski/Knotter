import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

export const updateParameterName = (parameterId: string, newName: string) => {
    updateParameter(parameterId, { name: newName });
};
