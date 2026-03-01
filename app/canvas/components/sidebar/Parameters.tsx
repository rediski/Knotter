'use client';

import { useState, memo, useMemo, Fragment } from 'react';

import { parameterTypes, ParameterType } from '@/canvas/_core/_/parameter';
import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EmptyState } from '@/components/UI/EmptyState';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';
import { Structure } from '@/canvas/components/parameters/Structure';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';
import { createParameter } from '@/canvas/utils/parameters/createParameter';
import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';

import { Plus } from 'lucide-react';

export const Parameters = memo(function Parameters({ panelId }: { panelId?: string }) {
    const [parameterName, setParameterName] = useState<string>('');
    const [parameterType, setParameterType] = useState<ParameterType>('number');

    const parameters = useCanvasStore((state) => state.parameters);
    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));

    const foundParameterType = parameterTypes.find((parameter) => parameter.type === parameterType);

    if (!foundParameterType) return;

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const hasNoFilteredResults = parameters.length > 0 && filteredParameters.length === 0;
    const hasNoParameters = parameters.length === 0;

    return (
        <div className="flex flex-col gap-1 h-full overflow-y-auto p-1">
            <div className="flex gap-1 items-center">
                <Input
                    value={parameterName}
                    onChange={setParameterName}
                    placeholder="Имя переменной"
                    className="bg-depth-2"
                    max={16}
                />

                <DropdownAbsolute title={foundParameterType.label} icon={getParameterIcon(parameterType)}>
                    {parameterTypes.map((parameter) => {
                        const Icon = getParameterIcon(parameter.type);

                        return (
                            <button
                                key={parameter.type}
                                onClick={() => setParameterType(parameter.type)}
                                className="px-3 py-2 w-full flex items-center gap-2 text-left bg-depth-3 hover:bg-depth-4 rounded-md cursor-pointer"
                            >
                                <Icon size={16} className="min-w-4" />

                                <p className="w-max">{parameter.label}</p>
                            </button>
                        );
                    })}
                </DropdownAbsolute>

                <button
                    onClick={() => createParameter(parameterName, parameterType)}
                    className={`
                        flex items-center justify-center max-w-8 w-full h-8 rounded-md cursor-pointer
                        ${parameterName.length === 0 ? 'bg-depth-2/50 text-foreground/50' : 'bg-depth-2 text-foreground'} 
                    `}
                    disabled={parameterName.length === 0}
                >
                    <Plus size={16} />
                </button>
            </div>

            {filteredParameters.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {filteredParameters.map((filteredParameter) => {
                        const parameter = parameters.find((parameter) => parameter.id === filteredParameter.id);

                        if (!parameter) {
                            throw new Error(`Parameter с id ${filteredParameter.id} не найден`);
                        }

                        if (isNumber(parameter)) {
                            return <Number key={parameter.id} parameter={parameter} />;
                        }

                        if (isString(parameter)) {
                            return <String key={parameter.id} parameter={parameter} />;
                        }

                        if (isBoolean(parameter)) {
                            return <Boolean key={parameter.id} parameter={parameter} />;
                        }

                        if (isEnum(parameter)) {
                            return <Enum key={parameter.id} parameter={parameter} />;
                        }

                        if (isStructure(parameter)) {
                            return <Structure key={parameter.id} parameter={parameter} />;
                        }
                    })}
                </div>
            ) : (
                <Fragment>
                    {hasNoFilteredResults ? (
                        <EmptyState message="Параметры с таким именем не найдены" />
                    ) : (
                        hasNoParameters && <EmptyState message="Параметры не найдены" />
                    )}
                </Fragment>
            )}
        </div>
    );
});
