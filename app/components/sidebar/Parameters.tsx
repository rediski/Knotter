import { useParams } from 'next/navigation';
import { NODE_SHAPES } from '@/_core/_/nodeShapeType';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';
import { ParameterItem } from '@/components/parameters/ParameterItem';
import { CreateParameterForm } from '@/components/parameters/CreateParameterForm';

import { useNodeContent } from '../parameters/useNodeContent';
import { useItemsStore } from '@/store/useItemsStore';

import { hasParameterInNode } from '@/utils/nodes/hasParameterInNode';
import { addSelectedParametersToNode } from '@/utils/nodes/addSelectedParametersToNode';
import { getNodes } from '@/utils/nodes/getNodes';

import { Search, Plus, X } from 'lucide-react';

export const Paramters = () => {
    const params = useParams();
    const nodeId = params.nodeId as string;

    const { currentSceneId, scenes } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const openedNode = nodes.find((item) => item.id === nodeId && item.kind === 'node');

    const {
        filteredParameters,
        parameters,
        filterText,
        selectedParameters,

        setFilterText,

        selectParameters,
        deleteSelectedParameters,

        draggingId,
        insertPosition,
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    } = useNodeContent();

    if (!openedNode) return <EmptyState message="Необходимо перейти в один из узлов" />;

    const Icon = NODE_SHAPES[openedNode.shapeType]?.icon;

    if (!Icon) return null;

    const selectedIds = Array.from(selectedParameters);
    const selectedParametersList = parameters.filter((parameter) => selectedParameters.has(parameter.id));

    const hasSelectedParameters = selectedIds.length > 0;
    const hasNotAddedParameters = selectedIds.some((id) => !hasParameterInNode(id, nodeId));
    const hasRootParameters = selectedParametersList.some((parameter) => parameter.parentId === null);

    const canAddSelected = hasSelectedParameters && hasNotAddedParameters && hasRootParameters;
    const canDeleteSelected = hasSelectedParameters && hasNotAddedParameters;

    const actionButtons = [
        {
            onClick: () => addSelectedParametersToNode(nodeId),
            icon: Plus,
            iconProps: { size: 16 },
            disabled: !canAddSelected,
        },
        {
            onClick: deleteSelectedParameters,
            icon: X,
            iconProps: { size: 16 },
            disabled: !canDeleteSelected,
        },
    ];

    return (
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto max-h-[calc(100vh-8px-32px-4px)]">
            <div className="flex flex-col gap-1 p-1 bg-depth-1 border border-depth-3 rounded-md">
                <Input
                    value={filterText}
                    onChange={setFilterText}
                    icon={Search}
                    placeholder="Поиск..."
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
                            className={`
                                flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 rounded-md border border-depth-3 disabled:opacity-30 
                                ${button.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <button.icon {...button.iconProps} />
                        </button>
                    ))}
                </div>

                <ul
                    className="flex flex-col gap-1 p-1 list-none relative"
                    ref={listRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                >
                    {filteredParameters.length > 0 ? (
                        <>
                            {insertPosition !== null && draggingId && (
                                <div
                                    className="absolute left-1 right-1 h-0.5 bg-bg-accent rounded-full z-20 pointer-events-none"
                                    style={{
                                        top: `calc(${insertPosition} * (100% / ${filteredParameters.length}))`,
                                        transition: 'top 0.05s ease-out',
                                    }}
                                />
                            )}

                            {filteredParameters.map((parameter) => (
                                <li
                                    key={parameter.id}
                                    className="list-none"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, parameter.id)}
                                >
                                    <ParameterItem
                                        parameter={parameter}
                                        selectedIds={selectedParameters}
                                        onSelect={selectParameters}
                                        hasParameterInNode={hasParameterInNode(parameter.id, nodeId)}
                                    />
                                </li>
                            ))}
                        </>
                    ) : (
                        <EmptyState
                            message={
                                parameters.length === 0 ? 'Параметры не найдены' : 'Параметры с таким именем не найдены'
                            }
                        />
                    )}
                </ul>
            </div>
        </div>
    );
};
