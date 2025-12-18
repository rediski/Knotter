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
import { useParameters } from '@/canvas/hooks/Parameters/_core/useParameters';
import { NodeParameters } from '../CanvasNodes/NodeParameters';
import { OptionPicker } from '@/components/UI/OptionPicker';

export const Inspector = memo(function Inspector() {
    const {
        staticDropdowns,

        isEdge,
        selectedNode,
        shapeType,
        positionX,
        positionY,

        сhangeItemName,
        changeItemDescription,
        changeNodeShapeType,
        changeNodePosition,
    } = useInspector();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const { parameters, addParameterToNode } = useParameters();

    const selectedItem = useCanvasStore((state) => state.selectedItem);

    const nodeParameters = selectedNode?.nodeParameters;

    if (!selectedItem || !nodeParameters) {
        return <EmptyState message="Выберите элемент для инспектора" />;
    }

    const filteredParameters = parameters.filter(
        (template) => !nodeParameters.some((nodeParam) => nodeParam.id === template.id),
    );

    const options = filteredParameters.map((param) => ({
        value: param.id,
        label: param.name,
        icon: getDynamicIcon(param.type),
    }));

    const Icon = getDynamicIcon(selectedItem?.kind || 'bug');

    return (
        <div className="flex flex-col h-screen overflow-y-auto pb-1">
            <div className="flex flex-col gap-1 m-1">
                <Input
                    value={selectedItem.name}
                    onChange={сhangeItemName}
                    placeholder="Название"
                    icon={Icon}
                    className="bg-depth-2"
                />

                <Textarea value={selectedItem.description} onChange={changeItemDescription} placeholder="Описание" />
            </div>

            <div className="flex flex-col gap-1">
                <div className="mx-1 flex flex-col gap-1">
                    {staticDropdowns.map((dd) => (
                        <Dropdown
                            key={dd.id}
                            title={dd.title}
                            disabled={isEdge}
                            isOpen={isDropdownOpen(dd.id)}
                            onToggle={() => toggleDropdown(dd.id)}
                        >
                            {dd.id === 1 && !isEdge && (
                                <ShapeButtons
                                    shapeType={shapeType}
                                    onTypeChange={(newShapeType) => changeNodeShapeType([selectedNode.id], newShapeType)}
                                />
                            )}

                            {dd.id === 2 && !isEdge && (
                                <PositionInputs positionX={positionX} positionY={positionY} onMove={changeNodePosition} />
                            )}
                        </Dropdown>
                    ))}
                </div>

                <hr className="border-b-0 border-depth-3" />

                {selectedNode && selectedItem.kind === 'node' && (
                    <div className="mx-1 flex flex-col gap-1">
                        <div className="flex flex-col gap-1">
                            <NodeParameters node={selectedNode} />

                            {filteredParameters.length > 0 && (
                                <div className="max-w-sm w-full m-auto">
                                    <OptionPicker
                                        options={options}
                                        onSelect={(parameterId) => addParameterToNode(selectedItem.id, parameterId)}
                                        placeholder="Выберите параметр"
                                        className="flex-1"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
