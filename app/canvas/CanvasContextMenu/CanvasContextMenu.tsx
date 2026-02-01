'use client';

import { useEffect, useRef, memo } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { selectAll } from '@/canvas/utils/items/selectAll';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';

import { getShape, getAllShapes } from '@/canvas/utils/nodes/getShape';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { changeShapeType } from '@/canvas/utils/nodes/changeShapeType';
import { selectAllNodes } from '@/canvas/utils/nodes/selectAllNodes';
import { createNode } from '@/canvas/utils/nodes/createNode';

import { createEdge } from '@/canvas/utils/edges/createEdge';
import { createText } from '@/canvas/utils/texts/createText';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
};

export const CanvasContextMenu = memo(function CanvasContextMenu({ isOpen, position, closeMenu }: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const offset = useCanvasStore((state) => state.offset);

    const nodes = getNodes(items);

    useClickOutside(menuRef, closeMenu);

    useEffect(() => {
        if (offset.x || offset.y) {
            closeMenu();
        }
    }, [offset.x, offset.y, closeMenu]);

    const onlyNodesSelected = selectedItemIds.every((id) => nodes.some((node) => node.id === id));

    return (
        <ContextMenu isOpen={isOpen} position={position} ref={menuRef}>
            <ContextMenuItem
                submenu={[
                    <ContextMenuItem
                        key="select-all"
                        onClick={() => {
                            selectAll();
                            closeMenu();
                        }}
                        disabled={items.length === 0}
                        shortcut="Ctrl + A"
                    >
                        Выбрать всё
                    </ContextMenuItem>,
                    <ContextMenuItem
                        key="select-all-nodes"
                        onClick={() => {
                            selectAllNodes();
                            closeMenu();
                        }}
                        disabled={nodes.length === 0}
                    >
                        Выбрать все узлы
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
                        Создать узел
                    </ContextMenuItem>,
                    <ContextMenuItem
                        key="create-edge"
                        onClick={() => {
                            createEdge();
                            closeMenu();
                        }}
                        disabled={selectedItemIds.length !== 1 || !nodes.some((n) => n.id === selectedItemIds[0])}
                        shortcut="Shift + E"
                    >
                        Создать связь
                    </ContextMenuItem>,
                    <ContextMenuItem
                        key="create-text"
                        onClick={() => {
                            createText();
                            closeMenu();
                        }}
                        shortcut="Shift + T"
                    >
                        Создать текст
                    </ContextMenuItem>,
                ]}
            >
                Создать
            </ContextMenuItem>

            <ContextMenuItem
                disabled={!onlyNodesSelected}
                submenu={getAllShapes().map((type) => {
                    const { label, icon } = getShape(type);
                    return (
                        <ContextMenuItem
                            key={`shape-${type}`}
                            onClick={() => {
                                changeShapeType(type);
                                closeMenu();
                            }}
                            icon={icon}
                        >
                            {label}
                        </ContextMenuItem>
                    );
                })}
            >
                Изменить форму
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
