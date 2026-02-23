'use client';

import { useRef } from 'react';

import { Node } from '@/canvas/_core/Node/Node';
import { Text } from '@/canvas/_core/Text/Text';

import { SelectionBox } from '@/canvas/components/CanvasSelectionBox/SelectionBox';
import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls/CanvasControls';

import { useCanvasInteraction } from '@/canvas/_core/Canvas/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/_core/Canvas/useCanvasRenderer';

import { useContextMenu } from '@/hooks/useContextMenu';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useCanvasInteraction({
        containerRef,
        canvasRef,
    });

    useCanvasRenderer({ canvasRef });

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
                <Text containerRef={containerRef} />
            </div>
        </div>
    );
}
