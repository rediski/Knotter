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
    const { width, isResizingSidebar, startSidebarResize } = useSidebarResize();

    useClickOutside(sidebarRef, () => menu.closeMenu());

    return (
        <div className="flex h-full items-stretch z-50 bg-background">
            <div
                onMouseDown={startSidebarResize}
                className={`
                    w-2 cursor-ew-resize flex items-center justify-center gap-0.25 flex-shrink-0 hover:bg-bg-accent/15 active:bg-bg-accent/30 group backdrop-blur-sm self-stretch
                    ${isResizingSidebar ? 'bg-bg-accent/30' : 'bg-background'}
                `}
            >
                <div
                    className={`
                        w-0.5 h-8 group-hover:bg-bg-accent rounded-md
                        ${isResizingSidebar ? 'bg-bg-accent' : 'bg-depth-3'}
                    `}
                />
            </div>

            <div
                ref={sidebarRef}
                className="flex flex-col flex-shrink-0 overflow-hidden bg-depth-1 border border-depth-3 rounded-md"
                style={{ width: `${width}px` }}
                onContextMenu={menu.handleContextMenu}
                onClick={() => menu.closeMenu()}
            >
                <SidebarPanels />
                <SidebarContextMenu menu={menu} />
            </div>
        </div>
    );
});
