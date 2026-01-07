'use client';

import { memo, useRef } from 'react';

import { SidebarPanels } from '@/canvas/components/CanvasSidebar/SidebarPanels';
import { SidebarContextMenu } from '@/canvas/components/CanvasSidebar/SidebarContextMenu';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';
import useSidebarResize from '@/canvas/hooks/useSidebarResize';
import { useClickOutside } from '@/canvas/hooks/useClickOutside';

export const CanvasSidebar = memo(function Sidebar() {
    const menu = useContextMenu();

    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const { width, startSidebarResize } = useSidebarResize();

    useClickOutside(sidebarRef, () => menu.closeMenu());

    return (
        <div
            ref={sidebarRef}
            className="absolute top-0 right-0 bottom-0 bg-depth-1 border-l border-depth-4 flex flex-col z-50 overflow-y-hidden"
            style={{ width }}
            onContextMenu={menu.handleContextMenu}
            onClick={() => menu.closeMenu()}
        >
            <div
                onMouseDown={startSidebarResize}
                className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-depth-3 z-50"
            />

            <SidebarPanels />

            <SidebarContextMenu menu={menu} />
        </div>
    );
});
