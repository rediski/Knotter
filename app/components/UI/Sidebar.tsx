import { ReactNode, memo, useEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import useSidebarResize from '@/canvas/hooks/useSidebarResize';
import { type Tab } from '@/canvas/components/CanvasSidebar/CanvasSidebar';

type SidebarProps = {
    minWidth?: number;
    baseWidth?: number;
    maxWidth?: number;
    tabs: Tab[];
    children: ReactNode;
};

const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_BASE_WIDTH = 420;
const SIDEBAR_MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1600;

export const Sidebar = memo(function Sidebar({
    minWidth = SIDEBAR_MIN_WIDTH,
    baseWidth = SIDEBAR_BASE_WIDTH,
    maxWidth = SIDEBAR_MAX_WIDTH,
    tabs,
    children,
}: SidebarProps) {
    const activeTab = useCanvasStore((state) => state.activeTab);

    const { width, isResizing, startResize, open, openSidebar, closeSidebar } = useSidebarResize({
        minWidth,
        baseWidth,
        maxWidth,
        tabs: tabs.map((t) => t.id),
    });

    useEffect(() => {
        if (activeTab !== null && !open) {
            openSidebar();
            return;
        }

        if (activeTab === null && open) {
            closeSidebar();
        }
    }, [activeTab, open, openSidebar, closeSidebar]);

    return (
        <aside
            style={{ width: `${width}px` }}
            className={`
                h-screen border-l border-depth-3 bg-depth-1 select-none flex-shrink-0 z-50 relative 
                ${!isResizing && 'transition-width ease-in-out'}
            `}
        >
            <div className="flex flex-col h-full overflow-hidden relative">{children}</div>

            <div
                onMouseDown={startResize}
                className={`
                    absolute top-0 left-0 h-full w-1 hover:cursor-ew-resize z-50 
                    ${isResizing ? 'bg-depth-6' : 'hover:bg-depth-6'}
                `}
            />
        </aside>
    );
});
