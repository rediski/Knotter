'use client';

import { memo, useMemo, Fragment } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';

import { CreateParameterForm } from '@/canvas/components/sidebar/CreateParameterForm';

import { Number } from '@/canvas/components/parameters/Number';
import { String } from '@/canvas/components/parameters/String';
import { Boolean } from '@/canvas/components/parameters/Boolean';
import { Enum } from '@/canvas/components/parameters/Enum';
import { Structure } from '@/canvas/components/parameters/Structure';

import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';

const parameterComponents = {
    number: Number,
    string: String,
    boolean: Boolean,
    enum: Enum,
    structure: Structure,
} as const;

export const Parameters = memo(function Parameters({ panelId }: { panelId?: string }) {
    const parameters = useItemsStore((state) => state.parameters);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const parametersMap = useMemo(() => new Map(parameters.map((parameter) => [parameter.id, parameter])), [parameters]);

    const hasNoFilteredResults = parameters.length > 0 && filteredParameters.length === 0;
    const hasNoParameters = parameters.length === 0;

    const renderParameter = (filteredParameter: { id: string }) => {
        const parameter = parametersMap.get(filteredParameter.id);

        if (!parameter) {
            console.error(`Parameter с id ${filteredParameter.id} не найден`);
            return null;
        }

        const Component = parameterComponents[parameter.type];

        if (!Component) {
            console.error(`Неизвестный тип параметра: ${parameter.type}`);
            return null;
        }

        return <Component key={parameter.id} parameter={parameter} />;
    };

    return (
        <div className="flex flex-col gap-1 h-full overflow-y-auto p-1">
            <CreateParameterForm />

            {filteredParameters.length > 0 ? (
                <div className="flex flex-col gap-1">{filteredParameters.map(renderParameter)}</div>
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
