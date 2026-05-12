'use client';

import type { Node } from '@/canvas/_core/_/canvas.types';

import { ReactNode, useEffect } from 'react';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/ThemeToggle';
import { CanvasSidebar } from '@/canvas/components/canvas/CanvasSidebar';
import { MobileFallback } from '@/canvas/components/canvas/MobileFallback';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useMobileDetection } from '@/hooks/useMobileDetection';

import { Home, LandPlot, Box, X } from 'lucide-react';

export function CanvasWrapper({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const items = useItemsStore((state) => state.items);
    const openedTabIds = useCanvasStore((state) => state.openedTabIds);
    const setOpenedTabIds = useCanvasStore((state) => state.setOpenedTabIds);

    const isOnCanvas = pathname === '/canvas/';

    useEffect(() => {
        const match = pathname.match(/^\/canvas\/([^/]+)\/?$/);
        const currentNodeId = match?.[1];

        if (!currentNodeId) return;

        const nodeStillExists = items.some((item): item is Node => item.id === currentNodeId && item.kind === 'node');

        if (!nodeStillExists) {
            if (openedTabIds.includes(currentNodeId)) {
                setOpenedTabIds(openedTabIds.filter((id) => id !== currentNodeId));
            }

            router.push('/canvas/');
        }
    }, [items, pathname, router, openedTabIds, setOpenedTabIds]);

    const closeNodeTab = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const newOpenedNodeIds = openedTabIds.filter((id) => id !== nodeId);
        setOpenedTabIds(newOpenedNodeIds);

        if (pathname !== `/canvas/${nodeId}/`) return;

        const lastTabId = newOpenedNodeIds[newOpenedNodeIds.length - 1];
        router.push(lastTabId ? `/canvas/${lastTabId}/` : '/canvas/');
    };

    const getOpenedNodesData = (): Node[] => {
        return openedTabIds
            .map((nodeId) => items.find((item): item is Node => item.id === nodeId && item.kind === 'node'))
            .filter((node): node is Node => node !== undefined);
    };

    const openedNodesData = getOpenedNodesData();

    const isMobile = useMobileDetection();

    if (isMobile !== false) {
        return <MobileFallback isMobile={isMobile} />;
    }

    return (
        <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 min-w-0 relative">
                <div className="flex flex-col gap-1 h-full">
                    <div className="flex items-center gap-1 shrink-0">
                        <div className="flex w-fit items-center gap-1">
                            <Link
                                href="/"
                                className="flex items-center justify-center p-2 rounded-md h-8 w-8 cursor-pointer bg-depth-2 hover:bg-depth-3 border border-depth-3"
                            >
                                <Home size={16} />
                            </Link>
                            <ThemeToggle />
                        </div>

                        <div
                            className={`
                                flex items-center gap-2 w-fit min-w-64 px-3 h-8 border rounded-md text-sm cursor-pointer select-none 
                                ${isOnCanvas ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-1 hover:bg-depth-2 border-depth-3 text-foreground'}
                            `}
                            onClick={() => router.push('/canvas')}
                        >
                            <LandPlot size={16} className="min-w-4" />
                            <div className={`border-l h-5 ${isOnCanvas ? 'border-bg-accent/10' : 'border-depth-4'}`} />
                            Холст
                        </div>

                        {openedNodesData.map((node) => (
                            <div
                                key={node.id}
                                className={`
                                    flex items-center justify-between w-fit min-w-64 px-3 h-8 border rounded-md cursor-pointer group select-none
                                    ${pathname === `/canvas/${node.id}/` ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-1 hover:bg-depth-2 border-depth-3 text-foreground'}
                                `}
                                onClick={() => router.push(`/canvas/${node.id}`)}
                            >
                                <div className="flex items-center">
                                    <Box size={16} className="min-w-4 shrink-0" />
                                    <div
                                        className={`border-l h-5 mx-2 ${pathname === `/canvas/${node.id}` ? 'border-bg-accent/10' : 'border-depth-4'}`}
                                    />
                                    <span className="truncate text-sm">{node.name}</span>
                                </div>

                                <button
                                    className={`
                                        opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity cursor-pointer
                                        ${pathname === `/canvas/${node.id}/` ? 'hover:bg-bg-accent/10' : 'hover:bg-depth-3'}
                                    `}
                                    onClick={(e) => closeNodeTab(node.id, e)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {children}
                </div>
            </div>

            <div className="flex h-full items-stretch">
                <CanvasSidebar />
            </div>
        </div>
    );
}
