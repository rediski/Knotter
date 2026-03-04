'use client';

import React, { memo, useRef } from 'react';

import { useSidebarStore } from '@/canvas/store/useSidebarStore';

import { SidebarContextMenu } from '@/canvas/components/sidebar/SidebarContextMenu';
import { useSidebarResize } from '@/canvas/components/sidebar/useSidebarResize';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SidebarPanel } from '@/canvas/components/sidebar/SidebarPanel';
import { EmptyState } from '@/components/UI/EmptyState';

export const CanvasSidebar = memo(function Sidebar() {
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
                    w-2 cursor-ew-resize flex items-center justify-center gap-px shrink-0 hover:bg-bg-accent/15 active:bg-bg-accent/30 group backdrop-blur-sm self-stretch
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
                <div className={`flex flex-col h-full`}>
                    {panels.length > 0 ? (
                        panels.map((panel) => {
                            return (
                                <React.Fragment key={panel.id}>
                                    <SidebarPanel panel={panel} />
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <EmptyState message="Нажмите ПКМ по этой области, чтобы добавить панель" />
                    )}
                </div>

                <SidebarContextMenu menu={menu} />
            </div>
        </div>
    );
});
