'use client';

import { memo } from 'react';

import { useInspector } from '@/canvas/CanvasSidebar/Inspector/useInspector';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useDropdownStore } from '@/canvas/store/dropdownStore';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/CanvasSidebar/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/CanvasSidebar/Inspector/PositionInputs';

import { getIcon } from '@/canvas/utils/nodes/getIcon';
import { getIncomingEdges } from '@/canvas/utils/edges/getIncomingEdges';
import { getOutgoingEdges } from '@/canvas/utils/edges/getOutgoingEdges';
import { changeShapeType } from '@/canvas/utils/nodes/changeShapeType';

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
        selectedNode,
        shapeType,
        positionX,
        positionY,

        changeItemName,
        changeItemDescription,
        changeItemsPosition,
    } = useInspector();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));
    const items = useCanvasStore((state) => state.items);

    const incomingEdges = getIncomingEdges(items, selectedNode?.id);
    const outgoingEdges = getOutgoingEdges(items, selectedNode?.id);

    const nodeParameters = selectedNode?.nodeParameters;

    if (!selectedItem || !nodeParameters) {
        return <EmptyState message="Выберите элемент для инспектора" />;
    }

    const Icon = getIcon(selectedItem?.kind || 'bug');

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
                        icon={Icon}
                        className="bg-depth-2"
                    />
                </div>
            )}

            {showDescription && selectedItem.kind !== 'edge' && (
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={selectedItem.kind === 'node' ? selectedItem.description : selectedItem.content}
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

                    {showEdgeFrom && incomingEdges.length > 0 && (
                        <Dropdown
                            title={FIELD_TITLES.EDGE_FROM}
                            isOpen={isDropdownOpen(3)}
                            onToggle={() => toggleDropdown(3)}
                        >
                            <div className="flex flex-col gap-1">
                                {incomingEdges.map((edge) => (
                                    <div
                                        key={edge.id}
                                        className="text-sm text-text-primary bg-depth-3 hover:bg-depth-4 px-3 py-2 rounded-md cursor-pointer"
                                    >
                                        {edge.name}
                                    </div>
                                ))}
                            </div>
                        </Dropdown>
                    )}

                    {showEdgeTo && outgoingEdges.length > 0 && (
                        <Dropdown title={FIELD_TITLES.EDGE_TO} isOpen={isDropdownOpen(4)} onToggle={() => toggleDropdown(4)}>
                            <div className="flex flex-col gap-1">
                                {outgoingEdges.map((edge) => (
                                    <div
                                        key={edge.id}
                                        className="text-sm text-text-primary bg-depth-3 hover:bg-depth-4 px-3 py-2 rounded-md cursor-pointer"
                                    >
                                        {edge.name}
                                    </div>
                                ))}
                            </div>
                        </Dropdown>
                    )}
                </>
            )}
        </div>
    );
});
