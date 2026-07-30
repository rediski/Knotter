'use client';

import { useEffect } from 'react';
import { useRef } from 'react';

import { Node } from '@/_core/Node';

import { SelectionBox } from '@/components/canvas/CanvasSelectionBox';
import { CanvasContextMenu } from '@/components/canvas/CanvasContextMenu';
import { Coordinates } from '@/components/canvas/Coordinates';

import { useCanvasInteraction } from '@/_core/Canvas/useCanvasInteraction';
import { useCanvasRenderer } from '@/_core/Canvas/useCanvasRenderer';
import { useCanvasHotkeys } from '@/_core/Canvas/useCanvasHotkeys';
import { useStoreHydration } from '@/hooks/useStoreHydration';

import { useContextMenu } from '@/hooks/useContextMenu';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useItemsStore } from '@/store/useItemsStore';

import { getNodes } from '@/utils/nodes/getNodes';
import { createScene } from '@/utils/scene/createScene';
import { getCurrentSceneItems } from '@/utils/canvas/getCurrentSceneItems';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { setCurrentNodeIds } = useItemsStore();

    useEffect(() => {
        setCurrentNodeIds(null);
    }, [setCurrentNodeIds]);

    const isCanvasHydrated = useStoreHydration(useCanvasStore);
    const isItemsHydrated = useStoreHydration(useItemsStore);

    const items = getCurrentSceneItems();

    useCanvasInteraction({ containerRef, canvasRef });
    useCanvasHotkeys(canvasRef);
    useCanvasRenderer(canvasRef);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    const hasNodes = getNodes(items).length !== 0;
    const isReady = isCanvasHydrated && isItemsHydrated;

    useEffect(() => {
        if (!isItemsHydrated) return;

        const initScene = async () => {
            const { scenes, currentSceneId } = useItemsStore.getState();

            if (Object.keys(scenes).length > 0 && currentSceneId) return;

            createScene('Сцена');
        };

        initScene();
    }, [isItemsHydrated]);

    return (
        <div ref={containerRef} className="h-full w-full relative rounded-md bg-depth-1" onContextMenu={handleContextMenu}>
            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />
            <Coordinates canvasRef={canvasRef} />

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
        </div>
    );
}
