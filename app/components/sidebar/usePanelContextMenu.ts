'use client';

import { useState, useCallback, useRef, RefObject } from 'react';

import type { SidebarPanel } from '@/_core/_/sidebarPanel';

import { useClickOutside } from '@/hooks/useClickOutside';

let activeMenuId: string | null = null;
const menuCallbacks: Map<string, () => void> = new Map();

interface UsePanelContextMenuParams {
    panel: SidebarPanel;
    panelRef: RefObject<HTMLDivElement | null>;
}

export function usePanelContextMenu({ panel, panelRef }: UsePanelContextMenuParams) {
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);

        if (activeMenuId === panel.id) {
            activeMenuId = null;
            menuCallbacks.delete(panel.id);
        }
    }, [panel.id]);

    const openMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (activeMenuId && activeMenuId !== panel.id && menuCallbacks.has(activeMenuId)) {
                menuCallbacks.get(activeMenuId)!();
            }

            setMenuPosition({ x: e.clientX, y: e.clientY });

            setIsMenuOpen(true);
            activeMenuId = panel.id;
            menuCallbacks.set(panel.id, closeMenu);
        },
        [panel.id, closeMenu],
    );

    useClickOutside(panelRef, closeMenu);

    return {
        menuRef,
        isMenuOpen,
        menuPosition,

        openMenu,
        closeMenu,
    };
}
