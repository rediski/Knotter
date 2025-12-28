import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

import { getShape, getAllShapes } from '@/canvas/utils/nodes/getShape';

import { LucideIcon } from 'lucide-react';

export type MenuItem = {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    shortcut?: string;
    type?: 'divider';
    submenu?: MenuItem[];
    icon?: LucideIcon;
};

export function useContextMenuItems() {
    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const offset = useCanvasStore((state) => state.offset);

    const nodes = getNodes(items);
    const edges = getEdges(items);
    const handlers = useCanvasHandlers();

    const onlyNodesSelected = selectedItemIds.every((id) => nodes.some((node) => node.id === id));

    const menuItems: MenuItem[] = [
        {
            label: 'Выбрать',
            submenu: [
                { label: 'Выбрать всё', onClick: handlers.selectAll, disabled: items.length === 0, shortcut: 'Ctrl + A' },
                { label: 'Выбрать все узлы', onClick: handlers.selectAllNodes, disabled: nodes.length === 0 },
                {
                    label: 'Выбрать все связи',
                    onClick: handlers.selectAllEdges,
                    disabled: edges.length === 0,
                    shortcut: 'Ctrl + E',
                },
            ],
        },
        {
            label: 'Создать',
            submenu: [
                { label: 'Создать узел', onClick: handlers.addNode, shortcut: 'Shift + A' },
                {
                    label: 'Создать связь',
                    onClick: handlers.startEdge,
                    disabled: selectedItemIds.length !== 1 || !nodes.some((n) => n.id === selectedItemIds[0]),
                    shortcut: 'Shift + E',
                },
                { label: 'Создать текст', onClick: handlers.addText, shortcut: 'Shift + T' },
            ],
        },
        {
            label: 'Изменить форму',
            submenu: getAllShapes().map((type) => {
                const { label, icon } = getShape(type);

                return {
                    label,
                    icon,
                    onClick: () => {
                        handlers.changeNodeShapeType(selectedItemIds, type);
                    },
                };
            }),
            disabled: !onlyNodesSelected,
        },
        { type: 'divider' },
        { label: 'Удалить выбранное', onClick: handlers.delete, disabled: selectedItemIds.length === 0, shortcut: 'Del' },
    ];

    return { menuItems, offset };
}
