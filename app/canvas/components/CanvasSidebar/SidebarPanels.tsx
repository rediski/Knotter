'use client';

import { SidebarPanel } from '@/canvas/components/CanvasSidebar/SidebarPanel';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useSidebarPanels } from '@/canvas/hooks/useSideBarPanels';
import { EmptyState } from '@/components/UI/EmptyState';

export function SidebarPanels() {
    const panels = useCanvasStore((state) => state.sidebarPanels);
    const { panelHeights, startPanelResize, resizingPanelIndex } = useSidebarPanels();

    const getPanelTop = (index: number) => panelHeights.slice(0, index).reduce((sum, height) => sum + height, 0);

    return (
        <div
            className={`
                relative flex-1 
                ${resizingPanelIndex !== null ? 'select-none' : ''}
            `}
        >
            {panels.length > 0 ? (
                panels.map((panel, index) => {
                    const isNotLastPanel = index < panels.length - 1;

                    return (
                        <div
                            key={panel.id}
                            className="absolute left-0 right-0 flex flex-col bg-depth-1 border-t border-depth-5 first:border-t-0"
                            style={{
                                height: panelHeights[index],
                                top: getPanelTop(index),
                                zIndex: panels.length + index,
                            }}
                        >
                            <SidebarPanel panel={panel} />

                            {isNotLastPanel && (
                                <div
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        startPanelResize(index, e.clientY);
                                    }}
                                    onContextMenu={(e) => e.stopPropagation()}
                                    className={`
                                        absolute -bottom-1 left-0 right-0 h-2 cursor-row-resize hover:bg-depth-5 
                                        ${resizingPanelIndex === index ? 'bg-depth-5' : 'bg-transparent'}
                                    `}
                                    style={{ zIndex: panels.length - index + 1 }}
                                />
                            )}
                        </div>
                    );
                })
            ) : (
                <EmptyState message="Нажмите ПКМ по этой области, чтобы добавить панель" />
            )}
        </div>
    );
}
