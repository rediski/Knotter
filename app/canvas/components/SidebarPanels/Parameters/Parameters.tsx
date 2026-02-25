'use client';

import { memo, Fragment, useMemo } from 'react';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EmptyState } from '@/components/UI/EmptyState';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useParameters } from '@/canvas/components/SidebarPanels/Parameters/useParameters';

import { parameterTypes } from '@/canvas/_core/_/parameter';
import { getIcon } from '@/canvas/utils/nodes/getIcon';

import { NumberParameter } from '@/canvas/components/Parameters/Number';
import { StringParameter } from '@/canvas/components/Parameters/String';
import { BooleanParameter } from '@/canvas/components/Parameters/Boolean';
import { EnumParameter } from '@/canvas/components/Parameters/Enum';
import { StructureParameter } from '@/canvas/components/Parameters/Structure';

import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { Plus } from 'lucide-react';

export const Parameters = memo(function Parameters({ panelId }: { panelId?: string }) {
    const {
        parameters,
        parameterName,
        parameterType,
        setParameterName,
        setParameterType,
        createParameter,
        updateParameter,
        removeParameter,
    } = useParameters();

    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredParameters = useMemo(() => {
        if (!filterText) return parameters;

        const searchText = filterText.toLowerCase();
        return parameters.filter(
            (parameter) =>
                parameter.name.toLowerCase().includes(searchText) || parameter.type.toLowerCase().includes(searchText),
        );
    }, [parameters, filterText]);

    const currentType = parameterTypes.find((parameter) => parameter.type === parameterType);

    if (!currentType) return;

    const showFilteredEmptyState = parameters.length > 0 && filteredParameters.length === 0;
    const showNoParametersState = parameters.length === 0;

    return (
        <div className="flex flex-col gap-1 overflow-y-auto m-1">
            <div className="flex gap-1 items-center">
                <Input
                    value={parameterName}
                    onChange={setParameterName}
                    placeholder="Имя переменной"
                    className="bg-depth-2"
                    max={16}
                />

                <DropdownAbsolute title={currentType?.label} icon={getIcon(parameterType)}>
                    {parameterTypes.map((parameter) => {
                        const Icon = getIcon(parameter.type);

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
                    {filteredParameters.map((p) => {
                        const parameter = parameters.find((parameter) => parameter.id === p.id);

                        if (!parameter) {
                            throw new Error(`Parameter с id ${p.id} не найден`);
                        }

                        const handleUpdateParameterName = (newName: string) => {
                            updateParameter(p.id, { name: newName });
                        };

                        const handleInputChange = (value: string) => {
                            updateParameter(parameter.id, {
                                data: value,
                            });
                        };

                        if (isNumber(parameter)) {
                            return (
                                <NumberParameter
                                    key={parameter.id}
                                    parameter={parameter}
                                    handleUpdateParameterName={handleUpdateParameterName}
                                    removeParameter={removeParameter}
                                />
                            );
                        }

                        if (isString(parameter)) {
                            return (
                                <StringParameter
                                    key={parameter.id}
                                    parameter={parameter}
                                    handleInputChange={handleInputChange}
                                    handleUpdateParameterName={handleUpdateParameterName}
                                    removeParameter={removeParameter}
                                />
                            );
                        }

                        if (isBoolean(parameter)) {
                            return (
                                <BooleanParameter
                                    key={parameter.id}
                                    parameter={parameter}
                                    handleUpdateParameterName={handleUpdateParameterName}
                                    removeParameter={removeParameter}
                                />
                            );
                        }

                        if (isEnum(parameter)) {
                            return (
                                <EnumParameter
                                    key={parameter.id}
                                    parameter={parameter}
                                    handleUpdateParameterName={handleUpdateParameterName}
                                    removeParameter={removeParameter}
                                />
                            );
                        }

                        if (isStructure(parameter)) {
                            return (
                                <StructureParameter
                                    key={parameter.id}
                                    parameter={parameter}
                                    removeParameter={removeParameter}
                                />
                            );
                        }
                    })}
                </div>
            ) : (
                <Fragment>
                    {showFilteredEmptyState ? (
                        <EmptyState message={`Нет параметров по запросу "${filterText}"`} />
                    ) : (
                        showNoParametersState && <EmptyState message="Создайте переменную для использования в инспекторе" />
                    )}
                </Fragment>
            )}
        </div>
    );
});
