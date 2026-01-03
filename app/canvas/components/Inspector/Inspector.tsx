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

export const Inspector = memo(function Inspector() {
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

    const nodeParameters = selectedNode?.nodeParameters;

    if (!selectedItem || !nodeParameters) {
        return <EmptyState message="Выберите элемент для инспектора" />;
    }

    const Icon = getDynamicIcon(selectedItem?.kind || 'bug');

    return (
        <div className="flex flex-col overflow-y-auto pb-1">
            <div className="flex flex-col gap-1 m-1">
                <Input
                    value={selectedItem.name}
                    onChange={сhangeItemName}
                    placeholder="Название"
                    icon={Icon}
                    className="bg-depth-2"
                />

                <Textarea
                    value={selectedItem.kind !== 'text' ? selectedItem.description : selectedItem.content}
                    onChange={changeItemDescription}
                    placeholder="Описание"
                />
            </div>

            <div className="flex flex-col gap-1">
                <div className="mx-1 flex flex-col gap-1">
                    {selectedItem.kind === 'node' && (
                        <>
                            <Dropdown title={'Форма'} isOpen={isDropdownOpen(1)} onToggle={() => toggleDropdown(1)}>
                                <ShapeButtons
                                    shapeType={shapeType}
                                    onTypeChange={(newShapeType) => changeNodeShapeType([selectedNode.id], newShapeType)}
                                />
                            </Dropdown>

                            <Dropdown title={'Трансформация'} isOpen={isDropdownOpen(2)} onToggle={() => toggleDropdown(2)}>
                                <PositionInputs positionX={positionX} positionY={positionY} onMove={changeItemsPosition} />
                            </Dropdown>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});
