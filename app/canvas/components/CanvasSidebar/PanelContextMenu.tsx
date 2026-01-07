'use client';

import { useRef, RefObject } from 'react';

import type { Position } from '@/canvas/canvas.types';
import type { SidebarPanel } from '@/canvas/components/CanvasSidebar/_sidebarPanel.types';

import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useSidebarPanels } from '@/canvas/hooks/useSideBarPanels';
import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface PanelContextMenuProps {
    panel: SidebarPanel;
    panelRef: RefObject<HTMLDivElement | null>;
    isMenuOpenLocally: boolean;
    closeMenu: () => void;
    position: Position;
}

export function PanelContextMenu({ panel, panelRef, closeMenu, isMenuOpenLocally, position }: PanelContextMenuProps) {
    const { removePanel, movePanel, addPanel, sidebarPanels: allPanels } = useSidebarPanels();
    const menuRef = useRef<HTMLDivElement>(null);

    const panelIndex = allPanels.findIndex((p) => p.id === panel.id);
    const canMoveUp = panelIndex > 0;
    const canMoveDown = panelIndex < allPanels.length - 1;

    useClickOutside(panelRef, closeMenu);

    const handleRemove = () => {
        removePanel(panel.id);
        closeMenu();
    };

    const handleMoveUp = () => {
        if (canMoveUp) {
            movePanel(panelIndex, panelIndex - 1);
            closeMenu();
        }
    };

    const handleMoveDown = () => {
        if (canMoveDown) {
            movePanel(panelIndex, panelIndex + 1);
            closeMenu();
        }
    };

    const handleAddPanel = () => {
        addPanel();
        closeMenu();
    };

    return (
        <div ref={menuRef}>
            <ContextMenu isOpen={isMenuOpenLocally} position={position}>
                <ContextMenuItem icon={Plus} onClick={handleAddPanel}>
                    Добавить панель
                </ContextMenuItem>

                {canMoveUp && (
                    <ContextMenuItem icon={ArrowUp} onClick={handleMoveUp}>
                        Переместить вверх
                    </ContextMenuItem>
                )}

                {canMoveDown && (
                    <ContextMenuItem icon={ArrowDown} onClick={handleMoveDown}>
                        Переместить вниз
                    </ContextMenuItem>
                )}

                <hr className="border-b-0 border-depth-6 my-1" />

                <ContextMenuItem icon={Minus} onClick={handleRemove}>
                    Удалить панель
                </ContextMenuItem>
            </ContextMenu>
        </div>
    );
}
