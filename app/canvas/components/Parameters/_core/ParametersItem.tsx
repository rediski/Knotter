'use client';

import { memo } from 'react';

import { NumberParameter } from '@/canvas/components/Parameters/types/NumberParameter';
import { StringParameter } from '@/canvas/components/Parameters/types/StringParameter';
import { BooleanParameter } from '@/canvas/components/Parameters/types/BooleanParameter';
import { EnumParameter } from '@/canvas/components/Parameters/types/EnumParameter';
import { ArrayParameter } from '@/canvas/components/Parameters/types/ArrayParameter';

import { useParametersItem } from '@/canvas/hooks/Parameters/_core/useParametersItem';

import {
    isNumberValue,
    isStringValue,
    isBooleanValue,
    isEnumValue,
    isArrayValue,
} from '@/canvas/utils/parameters/parameter.type-guards';

interface ParametersItemProps {
    parameterId: string;
    removeParameter: (parameterId: string) => void;
}

export const ParametersItem = memo(function ParametersItem({ parameterId, removeParameter }: ParametersItemProps) {
    const {
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
    } = useParametersItem(parameterId);

    if (isNumberValue(parameter)) {
        return (
            <NumberParameter
                parameter={parameter}
                handleUpdateParameterName={handleUpdateParameterName}
                handleUpdateCurrentValue={handleUpdateCurrentValue}
                handleUpdateMinValue={handleUpdateMinValue}
                handleUpdateMaxValue={handleUpdateMaxValue}
                handleUpdateStepValue={handleUpdateStepValue}
                removeParameter={removeParameter}
            />
        );
    }

    if (isStringValue(parameter)) {
        return (
            <StringParameter
                parameter={parameter}
                handleInputChange={handleInputChange}
                handleUpdateParameterName={handleUpdateParameterName}
                removeParameter={removeParameter}
            />
        );
    }

    if (isBooleanValue(parameter)) {
        return (
            <BooleanParameter
                parameter={parameter}
                handleCheckboxChange={handleCheckboxChange}
                handleUpdateParameterName={handleUpdateParameterName}
                removeParameter={removeParameter}
            />
        );
    }

    if (isEnumValue(parameter)) {
        return (
            <EnumParameter
                parameter={parameter}
                handleAddEnumOption={handleAddEnumOption}
                handleRemoveEnumOption={handleRemoveEnumOption}
                handleUpdateEnumOption={handleUpdateEnumOption}
                handleUpdateParameterName={handleUpdateParameterName}
                removeParameter={removeParameter}
            />
        );
    }

    if (isArrayValue(parameter)) {
        return (
            <ArrayParameter
                parameter={parameter}
                handleAddArrayParameter={handleAddArrayParameter}
                handleRemoveArrayParameter={handleRemoveArrayParameter}
                handleUpdateArrayParameterName={handleUpdateArrayParameterName}
                handleUpdateArrayParameterValue={handleUpdateArrayParameterValue}
                handleUpdateEnumOption={handleUpdateEnumOption}
                removeParameter={removeParameter}
            />
        );
    }
});
