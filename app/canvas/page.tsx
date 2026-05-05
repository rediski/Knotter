'use client';

import { useRef } from 'react';

import { Node } from '@/canvas/_core/Node';

import { SelectionBox } from '@/canvas/components/canvas/CanvasSelectionBox';
import { CanvasContextMenu } from '@/canvas/components/canvas/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/canvas/CanvasControls';

import { useCanvasInteraction } from '@/canvas/_core/Canvas/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/_core/Canvas/useCanvasRenderer';
import { useCanvasHotkeys } from '@/canvas/_core/Canvas/useCanvasHotkeys';
import { useStoreHydration } from '@/hooks/useStoreHydration';

import { useContextMenu } from '@/hooks/useContextMenu';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const isCanvasHydrated = useStoreHydration(useCanvasStore);
    const isItemsHydrated = useStoreHydration(useItemsStore);

    useCanvasInteraction({ containerRef, canvasRef });
    useCanvasHotkeys(canvasRef);
    useCanvasRenderer(canvasRef);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    const items = useItemsStore((state) => state.items);
    const hasNodes = getNodes(items).length !== 0;

    const isReady = isCanvasHydrated && isItemsHydrated;

    return (
        <div ref={containerRef} className="h-full w-full relative rounded-md bg-depth-1" onContextMenu={handleContextMenu}>
            <CanvasControls canvasRef={canvasRef} />
            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-depth-1 rounded-md border border-depth-3"
            />

            <SelectionBox containerRef={containerRef} />

            {isReady && hasNodes && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Node containerRef={containerRef} />
                </div>
            )}

            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-depth-1">
                    <div className="text-foreground">Загрузка сцены...</div>
                </div>
            )}
        </div>
    );
}
