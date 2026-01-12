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
import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';

import { useDropdownStore } from '@/canvas/store/dropdownStore';

interface InspectorProps {
    panelId?: string;
}

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    SHAPE: 'Форма',
    TRANSFORM: 'Трансформация',
    PARAMETERS: 'Параметры',
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

    const shouldShowField = (fieldTitle: string) => {
        if (!filterText) return true;
        return fieldTitle.toLowerCase().includes(filterText.toLowerCase());
    };

    const showName = shouldShowField(FIELD_TITLES.NAME);
    const showDescription = shouldShowField(FIELD_TITLES.DESCRIPTION);
    const showShape = shouldShowField(FIELD_TITLES.SHAPE);
    const showPosition = shouldShowField(FIELD_TITLES.TRANSFORM);
    const showParameters = shouldShowField(FIELD_TITLES.PARAMETERS);

    const hasVisibleFields = showName || showDescription || showShape || showPosition || showParameters;

    if (filterText && !hasVisibleFields) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto p-1 gap-1">
            {showName && (
                <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={selectedItem.kind !== 'text' ? selectedItem.description : selectedItem.content}
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
                                onTypeChange={(newShapeType) => changeNodeShapeType([selectedNode.id], newShapeType)}
                            />
                        </Dropdown>
                    )}

                    {showPosition && (
                        <Dropdown
                            title={FIELD_TITLES.TRANSFORM}
                            isOpen={isDropdownOpen(2)}
                            onToggle={() => toggleDropdown(2)}
                        >
                            <PositionInputs positionX={positionX} positionY={positionY} onMove={changeItemsPosition} />
                        </Dropdown>
                    )}

                    {showParameters && (
                        <Dropdown
                            title={FIELD_TITLES.PARAMETERS}
                            isOpen={isDropdownOpen(3)}
                            onToggle={() => toggleDropdown(3)}
                        >
                            <NodeParameters node={selectedItem} />
                        </Dropdown>
                    )}
                </>
            )}
        </div>
    );
});
