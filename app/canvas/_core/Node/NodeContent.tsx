'use client';

import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';
import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';
import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';
import { LocalParameter } from '@/canvas/_core/Node/LocalParameter';

import { useNodeContent } from '@/canvas/_core/Node/useNodeContent';

import { Search, ArrowBigUp, ArrowBigDown, Plus, X } from 'lucide-react';

export default function NodeContent() {
    const {
        node,
        nodeParameters,
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
        addParametersToNode,
    } = useNodeContent();

    if (!node) return null;

    const actionButtons = [
        {
            onClick: addParametersToNode,
            icon: Plus,
            iconProps: { size: 16, strokeWidth: 3 },
        },
        {
            onClick: moveSelectedParametersUp,
            icon: ArrowBigUp,
            iconProps: { size: 16, fill: 'var(--foreground)', stroke: 'var(--foreground)' },
        },
        {
            onClick: moveSelectedParametersDown,
            icon: ArrowBigDown,
            iconProps: { size: 16, fill: 'var(--foreground)', stroke: 'var(--foreground)' },
        },
        {
            onClick: deleteSelectedParameters,
            icon: X,
            iconProps: { size: 16, strokeWidth: 3 },
        },
    ];

    const Icon = NODE_SHAPES[node.shapeType].icon;

    return (
        <div className="flex gap-1 w-full overflow-y-auto h-full overflow-x-hidden" onClick={clearSelection}>
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
                        {Icon && (
                            <Icon
                                size={64}
                                className="flex items-center justify-center fill-depth-1"
                                strokeWidth={node.shapeType === 'point' ? 2 : 1.5}
                            />
                        )}
                    </div>

                    <div className="flex flex-col max-w-64 h-fit bg-depth-1 border border-depth-3 rounded-md text-sm px-3 py-1">
                        <h2 className="wrap-break-word text-base">{node.name || '...'}</h2>
                        <p className="wrap-break-word text-gray text-sm">{node.description || '...'}</p>
                    </div>
                </div>

                <div className="flex flex-col w-full min-w-xl gap-1 text-sm">
                    {nodeParameters.length > 0 && (
                        <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1 h-full">
                            {nodeParameters.map((parameter) => (
                                <LocalParameter key={parameter.id} parameter={parameter} nodeId={node.id} />
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
                                disabled={selectedParameters.size === 0}
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
