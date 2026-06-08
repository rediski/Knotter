'use client';

import { memo, useRef } from 'react';

import { SidebarPanel } from '@/components/sidebar/SidebarPanel';
import { SidebarContextMenu } from '@/components/sidebar/SidebarContextMenu';
import { EmptyState } from '@/components/UI/EmptyState';

import { useSidebarStore } from '@/store/useSidebarStore';
import { useSidebarResize } from '@/components/sidebar/useSidebarResize';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useClickOutside } from '@/hooks/useClickOutside';

export const Sidebar = memo(function Sidebar() {
    const panels = useSidebarStore((state) => state.sidebarPanels);

    const menu = useContextMenu();

    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const { width, isResizingSidebar, startSidebarResize } = useSidebarResize();

    useClickOutside(sidebarRef, () => menu.closeMenu());

    return (
        <div className="flex h-full items-stretch z-50 bg-background select-none">
            <div
                onMouseDown={startSidebarResize}
                className={`
                    w-2 cursor-ew-resize flex items-center justify-center gap-px shrink-0 hover:bg-bg-accent/15 active:bg-bg-accent/30 group
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
                className="flex flex-col shrink-0 overflow-hidden bg-depth-1 border border-depth-3 rounded-md"
                style={{ width: `${width}px` }}
                onContextMenu={menu.handleContextMenu}
                onClick={menu.closeMenu}
            >
                <div className="flex flex-col h-full">
                    {panels.length > 0 ? (
                        panels.map((panel) => <SidebarPanel key={panel.id} panel={panel} />)
                    ) : (
                        <EmptyState message="Нажмите ПКМ по этой области, чтобы добавить панель" />
                    )}
                </div>

                <SidebarContextMenu menu={menu} />
            </div>
        </div>
    );
});
