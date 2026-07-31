'use client';

import { memo } from 'react';

import type { CanvasItem, Edge, Node } from '@/_core/_/canvas.types';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';
import { ColorPicker } from '@/components/sidebar/ColorPicker';
import { ShapeButtons } from '@/components/sidebar/ShapeButtons';

import { useItemsStore } from '@/store/useItemsStore';
import { useDropdownStore } from '@/store/useDropdownStore';

import { changeName } from '@/utils/items/changeName';
import { changeColor } from '@/utils/items/changeColor';
import { deleteSelectedItemsById } from '@/utils/items/deleteSelectedItems';
import { changeNodeDescription } from '@/utils/nodes/changeNodeDescription';
import { changeNodePosition } from '@/utils/nodes/changeNodePosition';
import { changeShapeType } from '@/utils/nodes/changeShapeType';
import { getIncomingEdges } from '@/utils/edges/getIncomingEdges';
import { getOutgoingEdges } from '@/utils/edges/getOutgoingEdges';

import { Package, X, LineSquiggle } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    POSITION: 'Позиция',
    SHAPE: 'Форма',
    COLOR: 'Цвет',
    EDGE_FROM: 'Входящие связи',
    EDGE_TO: 'Исходящие связи',
} as const;

interface InspectorNodeProps {
    node: Node;
    items: CanvasItem[];
    showName: boolean;
    showDescription: boolean;
    showPosition: boolean;
    showShape: boolean;
    showColor: boolean;
    showEdgeFrom: boolean;
    showEdgeTo: boolean;
}

export const InspectorNode = memo(function InspectorNode({
    node,
    items,
    showName,
    showDescription,
    showPosition,
    showShape,
    showColor,
    showEdgeFrom,
    showEdgeTo,
}: InspectorNodeProps) {
    const { toggleDropdown, isDropdownOpen } = useDropdownStore();
    const { selectedItemIds, setSelectedItemIds } = useItemsStore();

    const incomingEdges = getIncomingEdges(items, node.id);
    const outgoingEdges = getOutgoingEdges(items, node.id);

    const renderEdgeList = (edges: Edge[], title: string, dropdownId: number) => {
        if (edges.length === 0) return null;

        return (
            <Dropdown title={title} isOpen={isDropdownOpen(dropdownId)} onToggle={() => toggleDropdown(dropdownId)}>
                <div className="flex flex-col gap-1">
                    {edges.map((edge) => {
                        const isSelected = selectedItemIds.includes(edge.id);

                        return (
                            <div
                                key={edge.id}
                                onClick={() => setSelectedItemIds([edge.id])}
                                className={`
                                flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group
                                ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 border border-depth-4 text-contrast'}
                            `}
                            >
                                <LineSquiggle size={16} />

                                <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/20' : 'border-depth-5'}`} />

                                <div className="flex items-center gap-1.5 flex-1">
                                    <span>{edge.name}</span>
                                </div>

                                <button
                                    className={`
                                    opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                    ${isSelected ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-5'}
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

    return (
        <div className="flex flex-col px-1 gap-1">
            {showName && (
                <div className="flex flex-col gap-1 pt-1">
                    <Input
                        value={node.name}
                        onChange={changeName}
                        placeholder={FIELD_TITLES.NAME}
                        icon={Package}
                        className="bg-depth-2 border border-depth-3"
                    />
                </div>
            )}

            {showDescription && (
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={node.description}
                        onChange={changeNodeDescription}
                        placeholder={FIELD_TITLES.DESCRIPTION}
                        className="border border-depth-3"
                    />
                </div>
            )}

            {showPosition && (
                <Dropdown title={FIELD_TITLES.POSITION} isOpen={isDropdownOpen(2)} onToggle={() => toggleDropdown(2)}>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center bg-depth-3 border border-depth-4 rounded-md">
                            <span className="text-sm text-center min-w-8 border-r border-depth-5">X</span>

                            <Input
                                type="number"
                                value={node.position.x.toString()}
                                onChange={(value) => {
                                    const newX = value === '' ? 0 : Number(value);
                                    changeNodePosition(node.id, { ...node.position, x: newX });
                                }}
                                className="bg-depth-3 border-depth-4"
                                allowNegative={true}
                                allowDecimal={true}
                            />
                        </div>

                        <div className="flex items-center bg-depth-3 border border-depth-4 rounded-md">
                            <span className="text-sm text-center min-w-8 border-r border-depth-5">Y</span>

                            <Input
                                type="number"
                                value={node.position.y.toString()}
                                onChange={(value) => {
                                    const newY = value === '' ? 0 : Number(value);
                                    changeNodePosition(node.id, { ...node.position, y: newY });
                                }}
                                className="bg-depth-3 border-depth-4"
                                allowNegative={true}
                                allowDecimal={true}
                            />
                        </div>
                    </div>
                </Dropdown>
            )}

            {showShape && (
                <Dropdown title={FIELD_TITLES.SHAPE} isOpen={isDropdownOpen(1)} onToggle={() => toggleDropdown(1)}>
                    <ShapeButtons
                        shapeType={node.shapeType ?? null}
                        onTypeChange={(newShapeType) => changeShapeType(newShapeType)}
                    />
                </Dropdown>
            )}

            {showColor && (
                <Dropdown title={FIELD_TITLES.COLOR} isOpen={isDropdownOpen(1.5)} onToggle={() => toggleDropdown(1.5)}>
                    <ColorPicker color={node.color} onColorChange={(newColor) => changeColor(newColor)} />
                </Dropdown>
            )}

            {showEdgeFrom && renderEdgeList(incomingEdges, FIELD_TITLES.EDGE_FROM, 3)}
            {showEdgeTo && renderEdgeList(outgoingEdges, FIELD_TITLES.EDGE_TO, 4)}
        </div>
    );
});
