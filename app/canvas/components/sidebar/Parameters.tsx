'use client';

import { memo, useMemo, Fragment } from 'react';

import { isNumber, isString, isBoolean, isEnum, isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { EmptyState } from '@/components/UI/EmptyState';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';
import { Structure } from '@/canvas/components/parameters/Structure';

import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';

import { AddParameterForm } from '@/canvas/components/sidebar/AddParameterForm';

export const Parameters = memo(function Parameters({ panelId }: { panelId?: string }) {
    const parameters = useItemsStore((state) => state.parameters);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const hasNoFilteredResults = parameters.length > 0 && filteredParameters.length === 0;
    const hasNoParameters = parameters.length === 0;

    return (
        <div className="flex flex-col gap-1 h-full overflow-y-auto p-1">
            <AddParameterForm />

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
