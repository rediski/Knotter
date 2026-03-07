'use client';

import { memo } from 'react';

import { useInspector } from '@/canvas/components/sidebar/useInspector';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useDropdownStore } from '@/canvas/store/useDropdownStore';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/sidebar/ShapeButtons';
import { PositionInputs } from '@/canvas/components/sidebar/PositionInputs';

import { getIncomingEdges } from '@/canvas/utils/edges/getIncomingEdges';
import { getOutgoingEdges } from '@/canvas/utils/edges/getOutgoingEdges';
import { changeShapeType } from '@/canvas/utils/nodes/changeShapeType';
import { deleteSelectedItemsById } from '@/canvas/utils/items/deleteSelectedItems';

import { Box, Link2Icon, X } from 'lucide-react';
import { useItemsStore } from '@/canvas/store/useItemsStore';

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

        changeItemName,
        changeItemDescription,
        changeItemsPosition,
    } = useInspector();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const items = useItemsStore((state) => state.items);
    const selectedEdgeIds = useItemsStore((state) => state.selectedEdgeIds);
    const setSelectedEdgeIds = useItemsStore((state) => state.setSelectedEdgeIds);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const incomingEdges = getIncomingEdges(items, selectedNode?.id);
    const outgoingEdges = getOutgoingEdges(items, selectedNode?.id);

    const nodeParameters = selectedNode?.parameters;

    const handleEdgeClick = (edgeId: string) => {
        setSelectedEdgeIds([edgeId]);
    };

    const renderEdgeList = (edges: any[], title: string, dropdownId: number) => {
        if (edges.length === 0) return null;

        return (
            <Dropdown title={title} isOpen={isDropdownOpen(dropdownId)} onToggle={() => toggleDropdown(dropdownId)}>
                <div className="flex flex-col gap-1">
                    {edges.map((edge) => {
                        const isSelected = selectedEdgeIds.includes(edge.id);

                        return (
                            <div
                                key={edge.id}
                                onClick={() => handleEdgeClick(edge.id)}
                                className={`
                                    flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group
                                    ${isSelected ? 'bg-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 text-contrast'}
                                `}
                            >
                                <Link2Icon size={16} />

                                <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/20' : 'border-depth-5'}`} />

                                <div className="w-full">{edge.id}</div>

                                <button
                                    className={`
                                        opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                        ${isSelected ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-3'}
                                    `}
                                    onClick={() => {
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

    if (!selectedItem || !nodeParameters) {
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
        <div className="flex flex-col overflow-y-auto m-1 gap-1">
            {showName && (
                <div className="flex flex-col gap-1">
                    <Input
                        value={selectedItem.name}
                        onChange={changeItemName}
                        placeholder={FIELD_TITLES.NAME}
                        icon={Box}
                        className="bg-depth-2"
                    />
                </div>
            )}

            {showDescription && selectedItem.kind === 'node' && (
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={selectedItem.description}
                        onChange={changeItemDescription}
                        placeholder={FIELD_TITLES.DESCRIPTION}
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
                                changeItemsPosition={changeItemsPosition}
                            />
                        </Dropdown>
                    )}

                    {showEdgeFrom && renderEdgeList(incomingEdges, FIELD_TITLES.EDGE_FROM, 3)}
                    {showEdgeTo && renderEdgeList(outgoingEdges, FIELD_TITLES.EDGE_TO, 4)}
                </>
            )}
        </div>
    );
});
