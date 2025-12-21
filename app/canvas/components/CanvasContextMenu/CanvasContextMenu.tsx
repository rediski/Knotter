'use client';

import { useEffect, useRef, memo } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { MenuItem, useContextMenuItems } from '@/canvas/hooks/CanvasContextMenu/useContextMenuItems';
import { useClickOutside } from '@/canvas/hooks/useClickOutside';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
};

export const CanvasContextMenu = memo(function CanvasContextMenu({ isOpen, position, closeMenu }: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { menuItems, offset } = useContextMenuItems();

    useClickOutside(menuRef, closeMenu);

    useEffect(() => {
        if (offset.x || offset.y) {
            closeMenu();
        }
    }, [offset.x, offset.y, closeMenu]);

    const renderMenuItem = (item: MenuItem, close: () => void, key: number) => {
        if (item.type === 'divider') {
            return <hr key={key} className="border-b-0 border-depth-6 my-1" />;
        }

        return (
            <ContextMenuItem
                key={key}
                onClick={() => {
                    item.onClick?.();
                    close();
                }}
                disabled={item.disabled}
                shortcut={item.shortcut}
                submenu={item.submenu?.map((sub, subIdx) => renderMenuItem(sub, close, subIdx))}
                icon={item.icon}
            >
                {item.label}
            </ContextMenuItem>
        );
    };

    return (
        <ContextMenu isOpen={isOpen} position={position} ref={menuRef}>
            {menuItems.map((item, idx) => renderMenuItem(item, closeMenu, idx))}
        </ContextMenu>
    );
});
