'use client';

import { memo } from 'react';

import type { CanvasItem, Edge } from '@/_core/_/canvas.types';

import { Input } from '@/components/UI/Input';
import { Dropdown } from '@/components/UI/Dropdown';
import { ColorPicker } from '@/components/sidebar/ColorPicker';

import { useItemsStore } from '@/store/useItemsStore';
import { useDropdownStore } from '@/store/useDropdownStore';

import { changeName } from '@/utils/items/changeName';
import { changeColor } from '@/utils/items/changeColor';
import { getNodes } from '@/utils/nodes/getNodes';

import { Package, LineSquiggle } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Наименование',
    COLOR: 'Цвет',
    EDGE_FROM_NODE: 'Начальный узел',
    EDGE_TO_NODE: 'Конечный узел',
} as const;

interface InspectorEdgeProps {
    edge: Edge;
    items: CanvasItem[];
}

export const InspectorEdge = memo(function InspectorEdge({ edge, items }: InspectorEdgeProps) {
    const { toggleDropdown, isDropdownOpen } = useDropdownStore();
    const { setSelectedItemIds } = useItemsStore();

    const nodes = getNodes(items);

    const renderNodeLink = (nodeId: string, title: string, dropdownId: number) => {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return null;

        return (
            <Dropdown title={title} isOpen={isDropdownOpen(dropdownId)} onToggle={() => toggleDropdown(dropdownId)}>
                <div
                    onClick={() => setSelectedItemIds([nodeId])}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md cursor-pointer group bg-depth-3 hover:bg-depth-4 border border-depth-4 text-contrast"
                >
                    <Package size={16} />
                    <div className="border-l h-5 border-depth-5" />
                    <span>{node.name}</span>
                </div>
            </Dropdown>
        );
    };

    return (
        <div className="flex flex-col m-1 gap-1">
            <div className="flex flex-col gap-1 pt-1">
                <Input
                    value={edge.name}
                    onChange={changeName}
                    placeholder={FIELD_TITLES.NAME}
                    icon={LineSquiggle}
                    className="bg-depth-2 border border-depth-3"
                />
            </div>

            {renderNodeLink(edge.from, FIELD_TITLES.EDGE_FROM_NODE, 5)}
            {renderNodeLink(edge.to, FIELD_TITLES.EDGE_TO_NODE, 6)}

            <Dropdown title={FIELD_TITLES.COLOR} isOpen={isDropdownOpen(1.5)} onToggle={() => toggleDropdown(1.5)}>
                <ColorPicker color={edge.color} onColorChange={(newColor) => changeColor(newColor)} />
            </Dropdown>

            <span className="text-xs text-gray text-right p-1 select-text">{edge.id}</span>
        </div>
    );
});
