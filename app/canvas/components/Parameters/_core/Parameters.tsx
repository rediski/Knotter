'use client';

import { memo, Fragment } from 'react';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EmptyState } from '@/components/UI/EmptyState';

import { ParametersItem } from '@/canvas/components/Parameters/_core/ParametersItem';

import { useParameters } from '@/canvas/hooks/Parameters/_core/useParameters';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { parameterTypes } from '@/canvas/utils/parameters/parameter.utils';

import { Plus } from 'lucide-react';

export const Parameters = memo(function Parameters() {
    const {
        parameters,
        parameterName,
        parameterType,
        setParameterName,
        setParameterType,
        createParameter,
        removeParameter,
    } = useParameters();

    const currentType = parameterTypes.find((parameter) => parameter.type === parameterType);

    if (!currentType) return;

    return (
        <div className="flex flex-col h-full flex-1 overflow-auto">
            <div className="flex gap-1 items-center m-1 mt-0">
                <Input
                    value={parameterName}
                    onChange={setParameterName}
                    placeholder="Имя переменной"
                    className="bg-depth-2"
                    max={16}
                />

                <DropdownAbsolute title={currentType?.label} icon={getDynamicIcon(parameterType)}>
                    {parameterTypes.map((parameter) => {
                        const Icon = getDynamicIcon(parameter.type);

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

            <hr className="border-b-0 border-depth-3" />

            {parameters.length !== 0 && (
                <div className="flex flex-col gap-1 m-1 mt-0">
                    {parameters.map((parameter) => (
                        <ParametersItem key={parameter.id} parameterId={parameter.id} removeParameter={removeParameter} />
                    ))}
                </div>
            )}

            {parameters.length === 0 && (
                <Fragment>
                    <EmptyState message="Создайте переменную для использования в инспекторе" />
                </Fragment>
            )}
        </div>
    );
});
