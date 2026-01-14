'use client';

import { SidebarPanel } from '@/canvas/components/CanvasSidebar/SidebarPanel';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { EmptyState } from '@/components/UI/EmptyState';

export function SidebarPanels() {
    const panels = useCanvasStore((state) => state.sidebarPanels);

    return (
        <div className={`flex flex-col h-full`}>
            {panels.length > 0 ? (
                panels.map((panel) => {
                    return (
                        <div key={panel.id} className="relative flex-1 min-h-0">
                            <SidebarPanel panel={panel} />
                        </div>
                    );
                })
            ) : (
                <EmptyState message="Нажмите ПКМ по этой области, чтобы добавить панель" />
            )}
        </div>
    );
}
