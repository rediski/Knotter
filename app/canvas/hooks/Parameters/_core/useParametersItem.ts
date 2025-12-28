import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useParameters } from '@/canvas/hooks/Parameters/_core/useParameters';

import { useNumberParameter } from '@/canvas/hooks/Parameters/types/useNumberParameter';
import { useEnumParameter } from '@/canvas/hooks/Parameters/types/useEnumParameter';
import { useArrayParameter } from '@/canvas/hooks/Parameters/types/useArrayParameter';

export const useParametersItem = (parameterId: string) => {
    const parameters = useCanvasStore((state) => state.parameters);

    const { updateParameter } = useParameters();

    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!parameter) {
        throw new Error(`Parameter с id ${parameterId} не найден`);
    }

    const handleUpdateParameterName = (newName: string) => {
        updateParameter(parameterId, { name: newName });
    };

    const handleInputChange = (value: string) => {
        updateParameter(parameter.id, {
            value: value,
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        updateParameter(parameter.id, {
            value: checked,
        });
    };

    // prettier-ignore
    const { 
        handleUpdateCurrentValue, 
        handleUpdateMinValue, 
        handleUpdateMaxValue, 
        handleUpdateStepValue 
    } = useNumberParameter({ parameter, updateParameter });

    // prettier-ignore
    const { 
        handleAddEnumOption, 
        handleRemoveEnumOption, 
        handleUpdateEnumOption, 
    } = useEnumParameter({ parameter, updateParameter });

    // prettier-ignore
    const {
        handleAddArrayParameter,
        handleRemoveArrayParameter,
        handleUpdateArrayParameterName,
        handleUpdateArrayParameterValue,
    } = useArrayParameter({ parameter, updateParameter });

    return {
        parameter,

        handleInputChange,
        handleCheckboxChange,

        handleUpdateParameterName,

        handleUpdateCurrentValue,
        handleUpdateMinValue,
        handleUpdateMaxValue,
        handleUpdateStepValue,

        handleAddEnumOption,
        handleRemoveEnumOption,
        handleUpdateEnumOption,

        handleAddArrayParameter,
        handleRemoveArrayParameter,
        handleUpdateArrayParameterName,
        handleUpdateArrayParameterValue,
    };
};
