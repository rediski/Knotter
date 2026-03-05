'use client';

import { useRef } from 'react';

import { Node } from '@/canvas/_core/Node';

import { SelectionBox } from '@/canvas/components/canvas/CanvasSelectionBox';
import { CanvasContextMenu } from '@/canvas/components/canvas/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/canvas/CanvasControls';

import { useCanvasInteraction } from '@/canvas/_core/Canvas/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/_core/Canvas/useCanvasRenderer';
import { useCanvasHotkeys } from '@/canvas/_core/Canvas/useCanvasHotkeys';

import { useContextMenu } from '@/hooks/useContextMenu';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useCanvasInteraction({
        containerRef,
        canvasRef,
    });

    useCanvasHotkeys(canvasRef);
    useCanvasRenderer(canvasRef);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div ref={containerRef} className="h-full w-full relative rounded-md bg-depth-1" onContextMenu={handleContextMenu}>
            <CanvasControls canvasRef={canvasRef} />
            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-depth-1 rounded-md border border-depth-3"
            />

            <SelectionBox containerRef={containerRef} />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Node containerRef={containerRef} />
            </div>
        </div>
    );
}
