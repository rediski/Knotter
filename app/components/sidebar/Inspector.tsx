'use client';

import { memo } from 'react';

import type { Edge } from '@/_core/_/canvas.types';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useDropdownStore } from '@/store/useDropdownStore';

import { Dropdown } from '@/components/UI/Dropdown';

import { ColorPicker } from '@/components/sidebar/ColorPicker';
import { ShapeButtons } from '@/components/sidebar/ShapeButtons';

import { getNodes } from '@/utils/nodes/getNodes';
import { getSelectedItem } from '@/utils/items/getSelectedItems';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';
import { getIncomingEdges } from '@/utils/edges/getIncomingEdges';
import { getOutgoingEdges } from '@/utils/edges/getOutgoingEdges';
import { changeNodeName } from '@/utils/nodes/changeNodeName';
import { changeNodeDescription } from '@/utils/nodes/changeNodeDescription';
import { changeNodePosition } from '@/utils/nodes/changeNodePosition';
import { changeShapeType } from '@/utils/nodes/changeShapeType';
import { changeColor } from '@/utils/items/changeColor';
import { deleteSelectedItemsById } from '@/utils/items/deleteSelectedItems';

import { Box, Link2Icon, X, ArrowRight } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    POSITION: 'Позиция',
    SHAPE: 'Форма',
    COLOR: 'Цвет',
    TRANSFORM: 'Трансформация',
    EDGE_FROM: 'Входящие связи',
    EDGE_TO: 'Исходящие связи',
    EDGE_FROM_NODE: 'Начальный узел',
    EDGE_TO_NODE: 'Конечный узел',
} as const;

export const Inspector = memo(function Inspector({ panelId }: { panelId?: string }) {
    const selectedItem = getSelectedItem();
    const selectedNode = getSelectedNode();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const incomingEdges = getIncomingEdges(items, selectedNode?.id);
    const outgoingEdges = getOutgoingEdges(items, selectedNode?.id);

    const renderEdgeList = (edges: Edge[], title: string, dropdownId: number, isIncoming: boolean) => {
        if (edges.length === 0) return null;

        return (
            <Dropdown title={title} isOpen={isDropdownOpen(dropdownId)} onToggle={() => toggleDropdown(dropdownId)}>
                <div className="flex flex-col gap-1">
                    {edges.map((edge) => {
                        const isSelected = selectedItemIds.includes(edge.id);

                        const connectedNodeId = isIncoming ? edge.from : edge.to;
                        const connectedNodeName = nodes.find((node) => node.id === connectedNodeId)?.name;

                        return (
                            <div
                                key={edge.id}
                                onClick={() => setSelectedItemIds([edge.id])}
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
                                            <span>{connectedNodeName}</span>
                                            <ArrowRight size={14} />
                                            <span>{selectedNode?.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{selectedNode?.name}</span>
                                            <ArrowRight size={14} />
                                            <span>{connectedNodeName}</span>
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
    const showPosition = shouldShowField(FIELD_TITLES.POSITION);
    const showShape = shouldShowField(FIELD_TITLES.SHAPE);
    const showColor = shouldShowField(FIELD_TITLES.COLOR);
    const showEdgeFrom = shouldShowField(FIELD_TITLES.EDGE_FROM);
    const showEdgeTo = shouldShowField(FIELD_TITLES.EDGE_TO);
    const showEdgeFromNode = shouldShowField(FIELD_TITLES.EDGE_FROM_NODE);
    const showEdgeToNode = shouldShowField(FIELD_TITLES.EDGE_TO_NODE);

    const hasVisibleFields =
        showName ||
        showDescription ||
        showPosition ||
        showShape ||
        showColor ||
        showEdgeFrom ||
        showEdgeTo ||
        showEdgeFromNode ||
        showEdgeToNode;

    if (filterText && !hasVisibleFields) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />
            </div>
        );
    }

    return (
        <div className="overflow-y-auto mt-1 border-t border-depth-3">
            {selectedItem.kind === 'node' && (
                <div className="flex flex-col px-1 gap-1">
                    {showName && (
                        <div className="flex flex-col gap-1 pt-1">
                            <Input
                                value={selectedItem.name}
                                onChange={changeNodeName}
                                placeholder={FIELD_TITLES.NAME}
                                icon={Box}
                                className="bg-depth-2 border border-depth-3"
                            />
                        </div>
                    )}

                    {showDescription && (
                        <div className="flex flex-col gap-1">
                            <Textarea
                                value={selectedItem.description}
                                onChange={changeNodeDescription}
                                placeholder={FIELD_TITLES.DESCRIPTION}
                                className="border border-depth-3"
                            />
                        </div>
                    )}

                    {showPosition && (
                        <Dropdown
                            title={FIELD_TITLES.POSITION}
                            isOpen={isDropdownOpen(2)}
                            onToggle={() => toggleDropdown(2)}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center bg-depth-3 border border-depth-4 rounded-md">
                                    <span className="text-sm text-center min-w-8 border-r border-depth-5">X</span>

                                    <Input
                                        type="number"
                                        value={selectedItem.position.x.toString()}
                                        onChange={(value) => {
                                            const newX = value === '' ? 0 : Number(value);
                                            if (selectedNode) {
                                                changeNodePosition(selectedNode.id, { ...selectedNode.position, x: newX });
                                            }
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
                                        value={selectedItem.position.y.toString()}
                                        onChange={(value) => {
                                            const newY = value === '' ? 0 : Number(value);
                                            if (selectedNode) {
                                                changeNodePosition(selectedNode.id, { ...selectedNode.position, y: newY });
                                            }
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
                                shapeType={selectedNode?.shapeType ?? null}
                                onTypeChange={(newShapeType) => changeShapeType(newShapeType)}
                            />
                        </Dropdown>
                    )}

                    {showColor && (
                        <Dropdown
                            title={FIELD_TITLES.COLOR}
                            isOpen={isDropdownOpen(1.5)}
                            onToggle={() => toggleDropdown(1.5)}
                        >
                            <ColorPicker color={selectedItem.color} onColorChange={(newColor) => changeColor(newColor)} />
                        </Dropdown>
                    )}

                    {showEdgeFrom && renderEdgeList(incomingEdges, FIELD_TITLES.EDGE_FROM, 3, true)}
                    {showEdgeTo && renderEdgeList(outgoingEdges, FIELD_TITLES.EDGE_TO, 4, false)}
                </div>
            )}

            {selectedItem.kind === 'edge' && (
                <div className="flex flex-col m-1 gap-1">
                    {showEdgeFromNode && (
                        <Dropdown
                            title={FIELD_TITLES.EDGE_FROM_NODE}
                            isOpen={isDropdownOpen(5)}
                            onToggle={() => toggleDropdown(5)}
                        >
                            <div
                                onClick={() => setSelectedItemIds([selectedItem.from])}
                                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group bg-depth-3 hover:bg-depth-4 border border-depth-4 text-contrast"
                            >
                                <Link2Icon size={16} />
                                <div className="border-l h-5 border-depth-5" />
                                <span>{nodes.find((node) => node.id === selectedItem.from)?.name}</span>
                            </div>
                        </Dropdown>
                    )}

                    {showEdgeToNode && (
                        <Dropdown
                            title={FIELD_TITLES.EDGE_TO_NODE}
                            isOpen={isDropdownOpen(6)}
                            onToggle={() => toggleDropdown(6)}
                        >
                            <div
                                onClick={() => setSelectedItemIds([selectedItem.to])}
                                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group bg-depth-3 hover:bg-depth-4 border border-depth-4 text-contrast"
                            >
                                <Link2Icon size={16} />
                                <div className="border-l h-5 border-depth-5" />
                                <span>{nodes.find((node) => node.id === selectedItem.to)?.name}</span>
                            </div>
                        </Dropdown>
                    )}

                    {showColor && (
                        <Dropdown
                            title={FIELD_TITLES.COLOR}
                            isOpen={isDropdownOpen(1.5)}
                            onToggle={() => toggleDropdown(1.5)}
                        >
                            <ColorPicker color={selectedItem.color} onColorChange={(newColor) => changeColor(newColor)} />
                        </Dropdown>
                    )}
                </div>
            )}
        </div>
    );
});
