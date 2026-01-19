'use client';

import { useRef } from 'react';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls/CanvasControls';
import { CanvasNodes } from '@/canvas/components/CanvasNodes/CanvasNodes';
import { CanvasTexts } from '@/canvas/components/CanvasTexts/CanvasTexts';

import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';
import { useCanvasInteraction } from '@/canvas/hooks/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, selectItemsInArea } = useCanvasSelection();

    useCanvasInteraction({
        containerRef,
        canvasRef,
        selectionStart,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
    });

    useCanvasRenderer({ canvasRef, selectionStart, selectionEnd });

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div ref={containerRef} className="h-full w-full relative rounded-md bg-depth-1" onContextMenu={handleContextMenu}>
            <CanvasControls />
            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-depth-1 rounded-md border border-depth-3"
            />

            <div className="absolute inset-0 overflow-hidden">
                <CanvasNodes />
                <CanvasTexts />
            </div>
        </div>
    );
}
