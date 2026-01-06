'use client';

import { useEffect, useRef, memo } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getShape, getAllShapes } from '@/canvas/utils/nodes/getShape';

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
    const edges = getEdges(items);
    const handlers = useCanvasHandlers();

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
                            handlers.selectAll();
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
                            handlers.selectAllNodes();
                            closeMenu();
                        }}
                        disabled={nodes.length === 0}
                    >
                        Выбрать все узлы
                    </ContextMenuItem>,
                    <ContextMenuItem
                        key="select-all-edges"
                        onClick={() => {
                            handlers.selectAllEdges();
                            closeMenu();
                        }}
                        disabled={edges.length === 0}
                        shortcut="Ctrl + E"
                    >
                        Выбрать все связи
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
                            handlers.addNode();
                            closeMenu();
                        }}
                        shortcut="Shift + A"
                    >
                        Создать узел
                    </ContextMenuItem>,
                    <ContextMenuItem
                        key="create-edge"
                        onClick={() => {
                            handlers.startEdge();
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
                            handlers.addText();
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
                                handlers.changeNodeShapeType(selectedItemIds, type);
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
                    handlers.delete();
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
