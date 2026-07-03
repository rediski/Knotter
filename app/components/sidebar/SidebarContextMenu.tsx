'use client';

import { type MouseEvent } from 'react';
import type { Position } from '@/_core/_/canvas.types';

import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useSidebarStore } from '@/store/useSidebarStore';
import { addPanel } from '@/utils/sidebar/addPanel';

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

    const sidebarPanels = useSidebarStore((state) => state.sidebarPanels);
    const setSidebarPanels = useSidebarStore((state) => state.setSidebarPanels);

    return (
        <ContextMenu isOpen={isOpen} position={position}>
            <ContextMenuItem
                icon={Plus}
                onClick={() => {
                    addPanel(sidebarPanels, setSidebarPanels);
                    closeMenu();
                }}
            >
                Добавить панель
            </ContextMenuItem>
        </ContextMenu>
    );
}
