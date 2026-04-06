'use client';

import { useCallback, useMemo, useState } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';

import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';
import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';
import { LocalParameter } from '@/canvas/_core/Node/LocalParameter';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';
import { reorderArray } from '@/canvas/utils/canvas/reorderArray';

import { Search } from 'lucide-react';

export default function NodeContent() {
    const items = useItemsStore((state) => state.items);
    const selectedTabId = useCanvasStore((state) => state.selectedTabId);

    const node = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (node?.kind !== 'node') return null;

    const parameters = useItemsStore((state) => state.parameters);
    const setItems = useItemsStore((state) => state.setItems);

    const currentNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;

    const nodeParameters = currentNode?.parameters ?? [];
    const nodeParametersIds = nodeParameters.map((parameter) => parameter.id);

    const [filterText, setFilterText] = useState('');

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);
    const shapeInfo = NODE_SHAPES[node.shapeType as keyof typeof NODE_SHAPES];
    const Icon = shapeInfo?.icon;

    const handleReorder = useCallback(
        (draggedId: string, targetId: string, position: 'top' | 'bottom' | null) => {
            const updatedParameters = reorderArray(nodeParameters, draggedId, targetId, position);

            if (updatedParameters === nodeParameters) return;

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
        <div className="flex gap-1 w-full overflow-y-auto overflow-x-hidden">
            <div className="flex flex-1 gap-1">
                <div className="flex flex-col gap-1">
                    <div
                        className={`flex items-center justify-center bg-depth-1 w-full max-h-64 max-w-64 min-w-64 aspect-square rounded-lg border border-depth-3 overflow-hidden`}
                        style={{
                            backgroundImage: `
                        linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                    `,
                            backgroundSize: '64px 64px',
                            backgroundPosition: `-1.5px -1.5px`,
                            backgroundRepeat: 'repeat',
                        }}
                    >
                        <Icon
                            size={64}
                            className="flex items-center justify-center fill-depth-1"
                            strokeWidth={node.shapeType === 'point' ? 2 : 1.5}
                        />
                    </div>

                    <div className="flex flex-col max-w-64 h-fit bg-depth-1 border border-depth-3 rounded-md text-sm px-3 py-1">
                        <h2 className="wrap-break-word text-base">{node.name || '...'}</h2>

                        <p className="wrap-break-word text-gray text-sm">{node.description || '...'}</p>
                    </div>
                </div>

                <div className="flex flex-col w-full min-w-xl gap-1 text-sm">
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
                        <div className="flex items-center justify-center h-full p-4 bg-depth-1 border border-depth-3 rounded-md">
                            <p className="text-sm text-gray">Нет добавленных параметров</p>
                        </div>
                    )}
                </div>
            </div>

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
        </div>
    );
}
