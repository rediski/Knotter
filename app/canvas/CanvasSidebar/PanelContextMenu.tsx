'use client';

import { RefObject } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';
import { Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
    menuRef: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    position: { x: number; y: number };
    canMoveUp: boolean;
    canMoveDown: boolean;
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
    onAdd,
    onRemove,
    onMoveUp,
    onMoveDown,
}: Props) {
    return (
        <div ref={menuRef}>
            <ContextMenu isOpen={isOpen} position={position}>
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

                <ContextMenuItem icon={Minus} onClick={onRemove}>
                    Удалить панель
                </ContextMenuItem>
            </ContextMenu>
        </div>
    );
}
