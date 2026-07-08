'use client';

import type { RefObject } from 'react';
import type { Position } from '@/_core/_/canvas.types';

import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
    menuRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    position: Position;
    canMoveUp: boolean;
    canMoveDown: boolean;
    sidebarPanelsLength: number;
    onAdd: () => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

export function PanelContextMenu({
    menuRef,
    isOpen,
    position,
    canMoveUp,
    canMoveDown,
    sidebarPanelsLength,
    onAdd,
    onRemove,
    onMoveUp,
    onMoveDown,
}: Props) {
    return (
        <ContextMenu isOpen={isOpen} position={position} ref={menuRef}>
            <ContextMenuItem icon={Plus} onClick={onAdd}>
                Добавить панель
            </ContextMenuItem>

            {canMoveUp && (
                <ContextMenuItem icon={ArrowUp} onClick={onMoveUp}>
                    Переместить вверх
                </ContextMenuItem>
            )}

            {canMoveDown && (
                <ContextMenuItem icon={ArrowDown} onClick={onMoveDown}>
                    Переместить вниз
                </ContextMenuItem>
            )}

            <hr className="border-b-0 border-depth-6 my-1" />

            <ContextMenuItem icon={Minus} onClick={onRemove} disabled={sidebarPanelsLength <= 1}>
                Удалить панель
            </ContextMenuItem>
        </ContextMenu>
    );
}
