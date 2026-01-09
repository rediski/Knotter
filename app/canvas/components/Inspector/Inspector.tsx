'use client';

import { memo } from 'react';

import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';

import { useDropdownStore } from '@/canvas/store/dropdownStore';

interface InspectorProps {
    panelId?: string;
}

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    SHAPE: 'Форма',
    TRANSFORM: 'Трансформация',
} as const;

export const Inspector = memo(function Inspector({ panelId }: InspectorProps) {
    const {
        selectedNode,
        shapeType,
        positionX,
        positionY,

        сhangeItemName,
        changeItemDescription,
        changeItemsPosition,
        changeNodeShapeType,
    } = useInspector();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));

    const nodeParameters = selectedNode?.nodeParameters;

    if (!selectedItem || !nodeParameters) {
        return <EmptyState message="Выберите элемент для инспектора" />;
    }

    const Icon = getDynamicIcon(selectedItem?.kind || 'bug');

    if (filterText) {
        const searchText = filterText.toLowerCase();
        const showName = FIELD_TITLES.NAME.toLowerCase().includes(searchText);
        const showDescription = FIELD_TITLES.DESCRIPTION.toLowerCase().includes(searchText);
        const showShape = FIELD_TITLES.SHAPE.toLowerCase().includes(searchText);
        const showPosition = FIELD_TITLES.TRANSFORM.toLowerCase().includes(searchText);

        if (!showName && !showDescription && !showShape && !showPosition) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-4">
                    <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />
                </div>
            );
        }

        return (
            <div className="flex flex-col overflow-y-auto pb-1">
                {showName && (
                    <div className="flex flex-col gap-1 m-1 mt-0">
                        <Input
                            value={selectedItem.name}
                            onChange={сhangeItemName}
                            placeholder={FIELD_TITLES.NAME}
                            icon={Icon}
                            className="bg-depth-2"
                        />
                    </div>
                )}

                {showDescription && (
                    <div className="flex flex-col gap-1 m-1 mt-0">
                        <Textarea
                            value={selectedItem.kind !== 'text' ? selectedItem.description : selectedItem.content}
                            onChange={changeItemDescription}
                            placeholder={FIELD_TITLES.DESCRIPTION}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <div className="mx-1 flex flex-col gap-1">
                        {selectedItem.kind === 'node' && (
                            <>
                                {showShape && (
                                    <Dropdown
                                        title={FIELD_TITLES.SHAPE}
                                        isOpen={isDropdownOpen(1)}
                                        onToggle={() => toggleDropdown(1)}
                                    >
                                        <ShapeButtons
                                            shapeType={shapeType}
                                            onTypeChange={(newShapeType) =>
                                                changeNodeShapeType([selectedNode.id], newShapeType)
                                            }
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
                                            onMove={changeItemsPosition}
                                        />
                                    </Dropdown>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto pb-1">
            <div className="flex flex-col gap-1 m-1 mt-0">
                <Input
                    value={selectedItem.name}
                    onChange={сhangeItemName}
                    placeholder={FIELD_TITLES.NAME}
                    icon={Icon}
                    className="bg-depth-2"
                />

                <Textarea
                    value={selectedItem.kind !== 'text' ? selectedItem.description : selectedItem.content}
                    onChange={changeItemDescription}
                    placeholder={FIELD_TITLES.DESCRIPTION}
                />
            </div>

            <div className="flex flex-col gap-1">
                <div className="mx-1 flex flex-col gap-1">
                    {selectedItem.kind === 'node' && (
                        <>
                            <Dropdown
                                title={FIELD_TITLES.SHAPE}
                                isOpen={isDropdownOpen(1)}
                                onToggle={() => toggleDropdown(1)}
                            >
                                <ShapeButtons
                                    shapeType={shapeType}
                                    onTypeChange={(newShapeType) => changeNodeShapeType([selectedNode.id], newShapeType)}
                                />
                            </Dropdown>

                            <Dropdown
                                title={FIELD_TITLES.TRANSFORM}
                                isOpen={isDropdownOpen(2)}
                                onToggle={() => toggleDropdown(2)}
                            >
                                <PositionInputs positionX={positionX} positionY={positionY} onMove={changeItemsPosition} />
                            </Dropdown>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});
