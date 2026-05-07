'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';

import { ParameterItem } from '@/canvas/[node]/ParameterItem';
import { LocalParameter } from '@/canvas/[node]/LocalParameter';
import { CreateParameterForm } from '@/canvas/[node]/CreateParameterForm';

import { useNodeContent } from '@/canvas/[node]/useNodeContent';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { addSelectedParametersToNode } from '@/canvas/utils/nodes/addSelectedParametersToNode';
import { hasParameterInNode } from '@/canvas/utils/nodes/hasParameterInNode';

import { Search, ArrowBigUp, ArrowBigDown, Plus, X } from 'lucide-react';

export default function NodePage() {
    const params = useParams();
    const nodeId = params.node as string;

    const items = useItemsStore((state) => state.items);
    const nodes = getNodes(items);

    const openedNode = nodes.find((item) => item.id === nodeId && item.kind === 'node');

    useEffect(() => {
        if (openedNode?.name) {
            document.title = openedNode.name;
        }
    }, [openedNode?.name]);

    const {
        filteredParameters,
        parameters,
        filterText,
        selectedParameters,

        setFilterText,

        selectParameters,
        clearSelection,
        moveSelectedParametersUp,
        moveSelectedParametersDown,
        deleteSelectedParameters,
    } = useNodeContent();

    if (!openedNode) return null;

    const Icon = NODE_SHAPES[openedNode.shapeType]?.icon;
    if (!Icon) return null;

    const selectedIds = Array.from(selectedParameters);
    const hasSelectedParameters = selectedIds.length > 0;

    const selectedParametersList = parameters.filter((parameter) => selectedParameters.has(parameter.id));

    const hasNotAddedParameters = selectedIds.some((id) => !hasParameterInNode(id, nodeId));
    const hasRootParameters = selectedParametersList.some((parameter) => parameter.parentId === null);

    const canAddOrDeleteSelected = hasSelectedParameters && hasNotAddedParameters && hasRootParameters;

    const actionButtons = [
        {
            onClick: () => addSelectedParametersToNode(nodeId),
            icon: Plus,
            iconProps: { size: 16, strokeWidth: 3 },
            disabled: !canAddOrDeleteSelected,
        },
        {
            onClick: moveSelectedParametersUp,
            icon: ArrowBigUp,
            iconProps: { size: 16, fill: 'var(--foreground)', stroke: 'var(--foreground)' },
            disabled: !hasSelectedParameters,
        },
        {
            onClick: moveSelectedParametersDown,
            icon: ArrowBigDown,
            iconProps: { size: 16, fill: 'var(--foreground)', stroke: 'var(--foreground)' },
            disabled: !hasSelectedParameters,
        },
        {
            onClick: deleteSelectedParameters,
            icon: X,
            iconProps: { size: 16, strokeWidth: 3 },
            disabled: !canAddOrDeleteSelected,
        },
    ];

    return (
        <div className="flex gap-1 w-full h-full" onClick={clearSelection}>
            <div
                className="bg-depth-1 max-w-3xl min-w-3xl w-full rounded-lg border border-depth-3 overflow-hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                    `,
                    backgroundSize: '128px 128px',
                }}
            >
                <div className="relative pt-84 flex flex-col items-center gap-4 min-w-md w-full h-fit overflow-y-auto">
                    <div className="ml-px flex items-center justify-center shrink-0">
                        {Icon && (
                            <Icon
                                size={96}
                                className="fill-depth-1"
                                strokeWidth={openedNode.shapeType === 'point' ? 2 : 1.5}
                            />
                        )}
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="flex flex-col gap-1 text-sm w-full">
                            {openedNode.parameters.length > 0 && (
                                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1 w-full max-h-105 overflow-y-auto shadow">
                                    {openedNode.parameters.map((parameter) => (
                                        <LocalParameter key={parameter.id} parameter={parameter} nodeId={openedNode.id} />
                                    ))}
                                </div>
                            )}

                            {openedNode.parameters.length === 0 && (
                                <div className="flex items-center justify-center bg-depth-1 border border-depth-3 rounded-md">
                                    <div className="text-sm text-gray bg-depth-2 w-full p-4 m-1 rounded-md border border-depth-3 text-center">
                                        Нет добавленных параметров
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                    <h2 className="wrap-break-word text-base w-fit h-fit bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                        {openedNode.name || '...'}
                    </h2>

                    <p className="wrap-break-word text-gray text-base w-fit flex-1 max-w-lg min-w-xs h-fit max-h-54.5 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 overflow-y-auto">
                        {openedNode.description || '...'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-1 flex-1 overflow-y-auto max-h-[calc(100vh-8px-32px-4px)]">
                <div className="flex flex-col gap-1 p-1 bg-depth-1 border border-depth-3 rounded-md">
                    <Input
                        value={filterText}
                        onChange={setFilterText}
                        icon={Search}
                        placeholder="Фильтр..."
                        className="bg-depth-2 border border-depth-3 flex-1"
                    />
                    <CreateParameterForm />
                </div>

                <div className="flex flex-col flex-1 w-full overflow-y-auto bg-depth-1 border border-depth-3 rounded-md">
                    <div className="flex gap-1 sticky top-0 bg-depth-1 z-20 p-1 border-b border-depth-3">
                        {actionButtons.map((button, index) => (
                            <button
                                key={index}
                                onClick={button.onClick}
                                disabled={button.disabled}
                                className="flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <button.icon {...button.iconProps} />
                            </button>
                        ))}
                    </div>

                    {filteredParameters.length > 0 && (
                        <div className="flex flex-col gap-1 p-1">
                            {filteredParameters.map((parameter) => (
                                <ParameterItem
                                    key={parameter.id}
                                    parameter={parameter}
                                    selectedIds={selectedParameters}
                                    onSelect={selectParameters}
                                    hasParameterInNode={hasParameterInNode(parameter.id, nodeId)}
                                />
                            ))}
                        </div>
                    )}

                    {filteredParameters.length === 0 && (
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
