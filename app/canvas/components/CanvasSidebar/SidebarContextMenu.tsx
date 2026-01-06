'use client';

import { type MouseEvent } from 'react';
import type { Position } from '@/canvas/canvas.types';

import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useSidebarPanels } from '@/canvas/hooks/useSideBarPanels';

import { Plus } from 'lucide-react';

type SidebarContextMenuProps = {
    menu: {
        isOpen: boolean;
        position: Position;
        handleContextMenu: (event: MouseEvent) => void;
        closeMenu: () => void;
    };
};

export function SidebarContextMenu({ menu }: SidebarContextMenuProps) {
    const { isOpen, position, closeMenu } = menu;
    const { addPanel } = useSidebarPanels();

    return (
        <ContextMenu isOpen={isOpen} position={position}>
            <ContextMenuItem
                icon={Plus}
                onClick={() => {
                    addPanel();
                    closeMenu();
                }}
            >
                Добавить панель
            </ContextMenuItem>
        </ContextMenu>
    );
}
