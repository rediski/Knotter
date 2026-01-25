'use client';

import Link from 'next/link';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { ToastProvider } from '@/components/UI/Toast';
import { CanvasSidebar } from '@/canvas/CanvasSidebar/CanvasSidebar';

import Canvas from '@/canvas/_core/Canvas/Canvas';
import NodeContent from '@/canvas/_core/Node/NodeContent';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useMobileDetection } from '@/hooks/useMobileDetection';

import { LoaderCircle, Frown, LandPlot, Box, X, type LucideIcon } from 'lucide-react';

export interface EditorModeOption {
    icon: LucideIcon;
}

export default function CanvasPage() {
    const items = useCanvasStore((state) => state.items);
    const openedNodeId = useCanvasStore((state) => state.openedNodeId);
    const openedNodesIds = useCanvasStore((state) => state.openedNodesIds);

    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setOpenedNodeId = useCanvasStore((state) => state.setOpenedNodeId);
    const setOpenedNodesIds = useCanvasStore((state) => state.setOpenedNodesIds);

    const isMobile = useMobileDetection();

    const closeNodeTab = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const newOpenedNodeIds = openedNodesIds.filter((id) => id !== nodeId);
        setOpenedNodesIds(newOpenedNodeIds);

        if (openedNodeId === nodeId) {
            if (newOpenedNodeIds.length > 0) {
                const nextNodeId = newOpenedNodeIds[newOpenedNodeIds.length - 1];
                setOpenedNodeId(nextNodeId);
                setSelectedItemIds([nextNodeId]);
            } else {
                setOpenedNodeId(null);
                setSelectedItemIds([]);
            }
        }
    };

    const switchToNodeTab = (nodeId: string) => {
        setOpenedNodeId(nodeId);
        setSelectedItemIds([nodeId]);
    };

    const switchToCanvas = () => {
        setOpenedNodeId(null);
        setSelectedItemIds([]);
    };

    const getOpenedNodesData = () => {
        return openedNodesIds
            .map((nodeId) => items.find((item) => item.id === nodeId && item.kind === 'node'))
            .filter(Boolean) as CanvasItem[];
    };

    if (isMobile === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-background w-full">
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle size={24} className="animate-spin" />

                    <p className="text-text-muted">Проверяем размеры экрана...</p>
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="flex flex-col gap-6 h-screen items-center justify-center w-full">
                <div className="flex justify-center items-center flex-col gap-6 max-w-2xl px-4 text-lg text-center">
                    <Frown size={48} className="text-text-accent" />

                    <h1 className="text-6xl font-extrabold uppercase">Упс!</h1>

                    <p className="max-w-2xl text-center text-lg mt-1">
                        Knotter разработан исключительно для ПК. Перейдите на устройство с большим экраном.
                    </p>

                    <Link
                        href="/"
                        className="flex items-center gap-1 px-3 py-1 bg-depth-2 hover:bg-depth-3 border border-depth-3 text-foreground text-base w-fit rounded-md select-none"
                    >
                        Вернуться на главную
                    </Link>
                </div>

                <div className="fixed flex items-center bottom-4 text-xs text-gray text-center">
                    <span>Размер экрана: {window.innerWidth}</span>

                    <X size={12} className="flex items-center justify-center" />

                    <span>{window.innerHeight}px</span>
                </div>
            </div>
        );
    }

    const openedNodesData = getOpenedNodesData();
    const isCanvasMode = openedNodeId === null;

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
                                            ${openedNodeId === node.id ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-1 hover:bg-depth-2 border-depth-3 text-foreground'}
                                        `}
                                        onClick={() => switchToNodeTab(node.id)}
                                    >
                                        <div className="flex items-center">
                                            <Box size={16} className="min-w-4 shrink-0" />

                                            <div
                                                className={`border-l h-5 mx-2 ${openedNodeId === node.id ? 'border-bg-accent/10' : 'border-depth-4'}`}
                                            />

                                            <span className="truncate text-sm">{node.name}</span>
                                        </div>

                                        <button
                                            className={`
                                                opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                                ${openedNodeId === node.id ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-3'}
                                            `}
                                            onClick={(e) => closeNodeTab(node.id, e)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {isCanvasMode ? <Canvas /> : <NodeContent />}
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
