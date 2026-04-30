'use client';

import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';
import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';
import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';
import { LocalParameter } from '@/canvas/_core/Node/LocalParameter';

import { getOpenedNode } from '@/canvas/utils/nodes/getOpenedNode';
import { addSelectedParametersToNode } from '@/canvas/utils/nodes/addSelectedParametersToNode';
import { hasParameterInNode } from '@/canvas/utils/nodes/hasParameterInNode';
import { useNodeContent } from '@/canvas/_core/Node/useNodeContent';

import { Search, ArrowBigUp, ArrowBigDown, Plus, X } from 'lucide-react';

export default function NodeContent() {
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

    const openedNode = getOpenedNode();
    if (!openedNode) return null;

    const Icon = NODE_SHAPES[openedNode.shapeType].icon;

    const selectedIds = Array.from(selectedParameters);
    const hasSelectedParameters = selectedIds.length > 0;

    const selectedParametersList = parameters.filter((parameter) => selectedParameters.has(parameter.id));

    const hasNotAddedParameters = selectedIds.some((id) => !hasParameterInNode(id));
    const hasRootParameters = selectedParametersList.some((parameter) => parameter.parentId === null);

    const canAddOrDeleteSelected = hasSelectedParameters && hasNotAddedParameters && hasRootParameters;

    const actionButtons = [
        {
            onClick: addSelectedParametersToNode,
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
        <div className="flex gap-1 w-full overflow-y-auto h-full overflow-x-hidden" onClick={clearSelection}>
            <div className="flex flex-col max-w-5xl w-full">
                <div
                    className="relative grid bg-depth-1 w-full h-full aspect-square rounded-lg border border-depth-3 overflow-hidden"
                    style={{
                        gridTemplateColumns: 'repeat(8, 128px)',
                        gridTemplateRows: 'repeat(10, 128px)',
                        backgroundImage: `
                            linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                        `,
                        backgroundSize: '128px 128px',
                        backgroundPosition: '-0.5px -15.5px',
                        backgroundRepeat: 'repeat',
                    }}
                >
                    <div className="flex flex-col items-center justify-center gap-4 col-start-3 col-end-7 row-start-4 row-end-5 justify-self-center min-w-md self-center">
                        {Icon && (
                            <Icon
                                size={96}
                                className="fill-depth-1"
                                strokeWidth={openedNode.shapeType === 'point' ? 2 : 1.5}
                            />
                        )}

                        <div className="flex flex-col w-full gap-1 text-sm">
                            {openedNode.parameters.length > 0 && (
                                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1 h-fit w-full shadow">
                                    {openedNode.parameters.map((parameter) => (
                                        <LocalParameter key={parameter.id} parameter={parameter} nodeId={openedNode.id} />
                                    ))}
                                </div>
                            )}

                            {openedNode.parameters.length === 0 && (
                                <div className="flex items-center justify-center h-fit bg-depth-1 border border-depth-3 rounded-md">
                                    <div className="text-sm text-gray bg-depth-2 w-full h-full p-4 m-1 rounded-md border border-depth-3 text-center">
                                        Нет добавленных параметров
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex flex-col gap-1 ">
                        <h2 className="wrap-break-word text-base w-fit h-fit bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                            {openedNode.name || '...'}
                        </h2>

                        <p className="wrap-break-word text-gray text-base w-fit flex-1 max-w-lg min-w-xs h-fit max-h-54.5 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 overflow-y-auto">
                            {openedNode.description || '...'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
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
                                    hasParameterInNode={hasParameterInNode(parameter.id)}
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
