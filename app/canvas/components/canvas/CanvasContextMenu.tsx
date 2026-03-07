'use client';

import { useRef, memo } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { selectAllItems } from '@/canvas/utils/items/selectAllItems';
import { selectAllEdges } from '@/canvas/utils/edges/selectAllEdges';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { selectAllNodes } from '@/canvas/utils/nodes/selectAllNodes';

import { createNode } from '@/canvas/utils/nodes/createNode';
import { initEdge } from '@/canvas/utils/edges/initEdge';

import { openTabs } from '@/canvas/utils/canvas/openTabs';
import { getSelectedNodesIds } from '@/canvas/utils/nodes/getSelectedNodes';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
};

export const CanvasContextMenu = memo(function CanvasContextMenu({ isOpen, position, closeMenu }: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    const items = useItemsStore((state) => state.items);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const nodes = getNodes(items);

    useClickOutside(menuRef, closeMenu);

    return (
        <ContextMenu isOpen={isOpen} position={position} ref={menuRef}>
            <ContextMenuItem
                submenu={[
                    <ContextMenuItem
                        key="select-all"
                        onClick={() => {
                            selectAllItems();
                            closeMenu();
                        }}
                        disabled={items.length === 0}
                        shortcut="Ctrl + Shift + A"
                    >
                        Все элементы
                    </ContextMenuItem>,

                    <ContextMenuItem
                        key="select-all-nodes"
                        onClick={() => {
                            selectAllNodes();
                            closeMenu();
                        }}
                        disabled={nodes.length === 0}
                        shortcut="Ctrl + A"
                    >
                        Все узлы
                    </ContextMenuItem>,

                    <ContextMenuItem
                        key="select-all-edges"
                        onClick={() => {
                            selectAllEdges();
                            closeMenu();
                        }}
                        disabled={nodes.length === 0}
                        shortcut="Ctrl + E"
                    >
                        Все связи
                    </ContextMenuItem>,
                ]}
            >
                Выбрать
            </ContextMenuItem>

            <ContextMenuItem
                submenu={[
                    <ContextMenuItem
                        key="create-node"
                        onClick={() => {
                            createNode();
                            closeMenu();
                        }}
                        shortcut="Shift + A"
                    >
                        Узел
                    </ContextMenuItem>,

                    <ContextMenuItem
                        key="initiate-edge"
                        onClick={() => {
                            initEdge();
                            closeMenu();
                        }}
                        disabled={selectedItemIds.length === 0 || items.length < 2}
                        shortcut="Shift + E"
                    >
                        Cвязь
                    </ContextMenuItem>,
                ]}
            >
                Создать
            </ContextMenuItem>

            <ContextMenuItem
                key="open-tab"
                onClick={() => {
                    openTabs(getSelectedNodesIds({ items, selectedItemIds }));
                    closeMenu();
                }}
                disabled={useItemsStore.getState().selectedItemIds.length === 0}
                shortcut="Space"
            >
                Открыть вкладку
            </ContextMenuItem>

            <hr className="border-b-0 border-depth-6 my-1" />

            <ContextMenuItem
                onClick={() => {
                    deleteSelectedItems();
                    closeMenu();
                }}
                disabled={selectedItemIds.length === 0}
                shortcut="Del"
            >
                Удалить выбранное
            </ContextMenuItem>
        </ContextMenu>
    );
});
