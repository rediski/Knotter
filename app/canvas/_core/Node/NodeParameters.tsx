'use client';

import { memo, useCallback, useMemo, useState } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';

import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';
import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';
import { LocalParameter } from '@/canvas/_core/Node/LocalParameter';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';

import { Search } from 'lucide-react';

export const NodeParameters = memo(function NodeParameters({ node }: { node: Node }) {
    const items = useItemsStore((state) => state.items);
    const parameters = useItemsStore((state) => state.parameters);
    const setItems = useItemsStore((state) => state.setItems);

    const currentNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;

    const nodeParameters = currentNode?.parameters ?? [];
    const nodeParametersIds = nodeParameters.map((p) => p.id);

    const [filterText, setFilterText] = useState('');

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const handleReorder = useCallback(
        (draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
            const fromIndex = nodeParameters.findIndex((p) => p.id === draggedId);
            const toIndex = nodeParameters.findIndex((p) => p.id === targetId);

            if (fromIndex === -1 || toIndex === -1) return;

            const updatedParameters = [...nodeParameters];
            const [movedParameter] = updatedParameters.splice(fromIndex, 1);
            const insertIndex = position === 'top' ? toIndex : toIndex + 1;

            updatedParameters.splice(insertIndex, 0, movedParameter);

            const updatedItems = items.map((item) => {
                if (item.kind === 'node' && item.id === node.id) {
                    return { ...item, parameters: updatedParameters };
                }
                return item;
            });

            setItems(updatedItems);
        },
        [nodeParameters, node.id, items, setItems],
    );

    return (
        <>
            <div className="flex flex-col gap-1 flex-1">
                <div className="flex flex-col gap-1 p-1 bg-depth-1 border border-depth-3 rounded-md">
                    <Input
                        value={filterText}
                        onChange={setFilterText}
                        icon={Search}
                        placeholder="Фильтр..."
                        className="bg-depth-2 border border-depth-3"
                    />

                    <CreateParameterForm depth={2} />
                </div>

                <div className="flex flex-col gap-1 flex-1 w-full h-fit overflow-y-auto p-1 bg-depth-1 border border-depth-3 rounded-md">
                    {filteredParameters.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {filteredParameters.map((parameter) => (
                                <ParameterItem key={parameter.id} parameter={parameter} />
                            ))}
                        </div>
                    )}

                    {filteredParameters.length <= 0 && (
                        <EmptyState
                            message={
                                parameters.length === 0 ? 'Параметры не найдены' : 'Параметры с таким именем не найдены'
                            }
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-1 w-full gap-1 text-sm">
                {nodeParameters.length > 0 && (
                    <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1">
                        {nodeParameters.map((parameter) => (
                            <LocalParameter
                                key={parameter.id}
                                parameter={parameter}
                                nodeId={node.id}
                                nodeParametersIds={nodeParametersIds}
                                onReorder={handleReorder}
                            />
                        ))}
                    </div>
                )}

                {nodeParameters.length === 0 && (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md border-depth-3">
                        <p className="text-sm text-gray">Нет параметров</p>
                    </div>
                )}
            </div>
        </>
    );
});
