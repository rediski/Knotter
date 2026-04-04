'use client';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import Canvas from '@/canvas/_core/Canvas';
import NodeContent from '@/canvas/_core/Node/NodeContent';

import { MobileFallback } from '@/canvas/components/canvas/MobileFallback';
import { ToastProvider } from '@/components/UI/Toast';
import { CanvasSidebar } from '@/canvas/components/canvas/CanvasSidebar';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { useMobileDetection } from '@/hooks/useMobileDetection';

import { LandPlot, Box, X } from 'lucide-react';

export default function CanvasPage() {
    const items = useItemsStore((state) => state.items);
    const setSelectedItemIds = useItemsStore((state) => state.setSelectedItemIds);

    const selectedTabId = useCanvasStore((state) => state.selectedTabId);
    const openedTabIds = useCanvasStore((state) => state.openedTabIds);

    const setSelectedTabId = useCanvasStore((state) => state.setSelectedTabId);
    const setOpenedTabIds = useCanvasStore((state) => state.setOpenedTabIds);

    const closeNodeTab = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const newOpenedNodeIds = openedTabIds.filter((id) => id !== nodeId);
        setOpenedTabIds(newOpenedNodeIds);

        if (selectedTabId === nodeId) {
            if (newOpenedNodeIds.length > 0) {
                const nextNodeId = newOpenedNodeIds[newOpenedNodeIds.length - 1];
                setSelectedTabId(nextNodeId);
                setSelectedItemIds([nextNodeId]);
            } else {
                setSelectedTabId(null);
                setSelectedItemIds([]);
            }
        }
    };

    const switchToNodeTab = (nodeId: string) => {
        setSelectedTabId(nodeId);
        setSelectedItemIds([nodeId]);
    };

    const switchToCanvas = () => {
        setSelectedTabId(null);
        setSelectedItemIds([]);
    };

    const getOpenedNodesData = () => {
        return openedTabIds
            .map((nodeId) => items.find((item) => item.id === nodeId && item.kind === 'node'))
            .filter(Boolean) as CanvasItem[];
    };

    const openedNodesData = getOpenedNodesData();
    const isCanvasMode = selectedTabId === null;

    const isMobile = useMobileDetection();

    if (isMobile !== false) {
        return <MobileFallback isMobile={isMobile} />;
    }

    return (
        <ToastProvider>
            <div className="flex flex-col h-screen w-screen bg-background">
                <div className="flex flex-1 min-h-0 overflow-hidden m-1">
                    <div className="flex-1 min-w-0 relative">
                        <div className="flex flex-col gap-1 h-full">
                            <div className="flex items-center gap-1 shrink-0">
                                <div
                                    className={`
                                        flex items-center gap-2 w-full px-3 h-8 border rounded-md text-sm cursor-pointer select-none
                                        ${isCanvasMode ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-1 hover:bg-depth-2 border-depth-3 text-foreground'}
                                    `}
                                    onClick={switchToCanvas}
                                >
                                    <LandPlot size={16} className="min-w-4" />
                                    <div
                                        className={`
                                            border-l h-5
                                            ${isCanvasMode ? 'border-bg-accent/10' : 'border-depth-4'}
                                        `}
                                    />
                                    Холст
                                </div>

                                {openedNodesData.map((node) => (
                                    <div
                                        key={node.id}
                                        className={`
                                            flex items-center justify-between w-full px-3 h-8 border rounded-md cursor-pointer group select-none
                                            ${selectedTabId === node.id ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-1 hover:bg-depth-2 border-depth-3 text-foreground'}
                                        `}
                                        onClick={() => switchToNodeTab(node.id)}
                                    >
                                        <div className="flex items-center">
                                            <Box size={16} className="min-w-4 shrink-0" />

                                            <div
                                                className={`border-l h-5 mx-2 ${selectedTabId === node.id ? 'border-bg-accent/10' : 'border-depth-4'}`}
                                            />

                                            <span className="truncate text-sm">{node.name}</span>
                                        </div>

                                        <button
                                            className={`
                                                opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                                ${selectedTabId === node.id ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-3'}
                                            `}
                                            onClick={(e) => closeNodeTab(node.id, e)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {isCanvasMode || openedNodesData.length === 0 ? <Canvas /> : <NodeContent />}
                        </div>
                    </div>

                    <div className="flex h-full items-stretch">
                        <CanvasSidebar />
                    </div>
                </div>
            </div>
        </ToastProvider>
    );
}
