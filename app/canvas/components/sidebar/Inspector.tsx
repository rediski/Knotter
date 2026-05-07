'use client';

import { memo } from 'react';

import type { Edge } from '@/canvas/_core/_/canvas.types';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { useInspector } from '@/canvas/components/sidebar/useInspector';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useDropdownStore } from '@/canvas/store/useDropdownStore';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/sidebar/ShapeButtons';
import { PositionInputs } from '@/canvas/components/sidebar/PositionInputs';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getIncomingEdges } from '@/canvas/utils/edges/getIncomingEdges';
import { getOutgoingEdges } from '@/canvas/utils/edges/getOutgoingEdges';
import { changeShapeType } from '@/canvas/utils/nodes/changeShapeType';
import { deleteSelectedItemsById } from '@/canvas/utils/items/deleteSelectedItems';

import { Box, Link2Icon, X, ArrowRight } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    SHAPE: 'Форма',
    TRANSFORM: 'Трансформация',
    EDGE_FROM: 'Входящие связи',
    EDGE_TO: 'Исходящие связи',
} as const;

export const Inspector = memo(function Inspector({ panelId }: { panelId?: string }) {
    const {
        shapeType,
        positionX,
        positionY,
        selectedItem,
        selectedNode,

        changeNodeName,
        changeNodeDescription,
        changeNodesPosition,
    } = useInspector();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const items = useItemsStore((state) => state.items);
    const nodes = getNodes(items);

    const selectedEdgeIds = useItemsStore((state) => state.selectedEdgeIds);
    const setSelectedEdgeIds = useItemsStore((state) => state.setSelectedEdgeIds);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const incomingEdges = getIncomingEdges(items, selectedNode?.id);
    const outgoingEdges = getOutgoingEdges(items, selectedNode?.id);

    const renderEdgeList = (edges: Edge[], title: string, dropdownId: number, isIncoming: boolean) => {
        if (edges.length === 0) return null;

        return (
            <Dropdown title={title} isOpen={isDropdownOpen(dropdownId)} onToggle={() => toggleDropdown(dropdownId)}>
                <div className="flex flex-col gap-1">
                    {edges.map((edge) => {
                        const isSelected = selectedEdgeIds.includes(edge.id);

                        const connectedNodeId = isIncoming ? edge.from : edge.to;
                        const connectedNodeName = nodes.find((node) => node.id === connectedNodeId)?.name;

                        return (
                            <div
                                key={edge.id}
                                onClick={() => setSelectedEdgeIds([edge.id])}
                                className={`
                                    flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group
                                    ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 border border-depth-4 text-contrast'}
                                `}
                            >
                                <Link2Icon size={16} />

                                <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/20' : 'border-depth-5'}`} />

                                <div className="flex items-center gap-1.5 flex-1">
                                    {isIncoming ? (
                                        <>
                                            <span className="font-medium">{connectedNodeName}</span>
                                            <ArrowRight size={14} className="text-text-muted" />
                                            <span className="text-text-muted">{selectedNode?.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-medium">{selectedNode?.name}</span>
                                            <ArrowRight size={14} className="text-text-muted" />
                                            <span className="text-text-muted">{connectedNodeName}</span>
                                        </>
                                    )}
                                </div>

                                <button
                                    className={`
                                        opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                        ${isSelected ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-5 '}
                                    `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSelectedItemsById(edge.id);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </Dropdown>
        );
    };

    if (!selectedItem) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    const shouldShowField = (fieldTitle: string) => {
        if (!filterText) return true;
        return fieldTitle.toLowerCase().includes(filterText.toLowerCase());
    };

    const showName = shouldShowField(FIELD_TITLES.NAME);
    const showDescription = shouldShowField(FIELD_TITLES.DESCRIPTION);
    const showShape = shouldShowField(FIELD_TITLES.SHAPE);
    const showPosition = shouldShowField(FIELD_TITLES.TRANSFORM);
    const showEdgeFrom = shouldShowField(FIELD_TITLES.EDGE_FROM);
    const showEdgeTo = shouldShowField(FIELD_TITLES.EDGE_TO);

    const hasVisibleFields = showName || showDescription || showShape || showPosition || showEdgeFrom || showEdgeTo;

    if (filterText && !hasVisibleFields) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto p-1 gap-1">
            {showName && selectedItem.kind === 'node' && (
                <div className="flex flex-col gap-1">
                    <Input
                        value={selectedItem.name}
                        onChange={changeNodeName}
                        placeholder={FIELD_TITLES.NAME}
                        icon={Box}
                        className="bg-depth-2 border border-depth-3"
                    />
                </div>
            )}

            {showDescription && selectedItem.kind === 'node' && (
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={selectedItem.description}
                        onChange={changeNodeDescription}
                        placeholder={FIELD_TITLES.DESCRIPTION}
                        className="border border-depth-3"
                    />
                </div>
            )}

            {selectedItem.kind === 'node' && (
                <>
                    {showShape && (
                        <Dropdown title={FIELD_TITLES.SHAPE} isOpen={isDropdownOpen(1)} onToggle={() => toggleDropdown(1)}>
                            <ShapeButtons
                                shapeType={shapeType}
                                onTypeChange={(newShapeType) => changeShapeType(newShapeType)}
                            />
                        </Dropdown>
                    )}

                    {showPosition && (
                        <Dropdown
                            title={FIELD_TITLES.TRANSFORM}
                            isOpen={isDropdownOpen(2)}
                            onToggle={() => toggleDropdown(2)}
                        >
                            <PositionInputs
                                positionX={positionX}
                                positionY={positionY}
                                changeItemsPosition={changeNodesPosition}
                            />
                        </Dropdown>
                    )}

                    {showEdgeFrom && renderEdgeList(incomingEdges, FIELD_TITLES.EDGE_FROM, 3, true)}
                    {showEdgeTo && renderEdgeList(outgoingEdges, FIELD_TITLES.EDGE_TO, 4, false)}
                </>
            )}
        </div>
    );
});
