'use client';

import { useRef, useState, useEffect } from 'react';

import { Node } from '@/canvas/_core/Node/Node';
import { Text } from '@/canvas/_core/Text/Text';

import { SelectionBox } from '@/canvas/CanvasSelectionBox/SelectionBox';
import { CanvasContextMenu } from '@/canvas/CanvasContextMenu/CanvasContextMenu';
import { CanvasControls } from '@/canvas/CanvasControls/CanvasControls';

import { useCanvasInteraction } from '@/canvas/_core/Canvas/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/_core/Canvas/useCanvasRenderer';
import { useCanvasSelection } from '@/canvas/_core/Canvas/useCanvasSelection';
import { useContextMenu } from '@/hooks/useContextMenu';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, selectItemsInArea } = useCanvasSelection();

    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }
    }, [containerRef.current]);

    useCanvasInteraction({
        containerRef,
        canvasRef,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
    });

    useCanvasRenderer({ canvasRef });

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div ref={containerRef} className="h-full w-full relative rounded-md bg-depth-1" onContextMenu={handleContextMenu}>
            <CanvasControls />
            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full bg-depth-1 rounded-md border border-depth-3"
            />

            <SelectionBox start={selectionStart} end={selectionEnd} containerHeight={containerHeight} />

            <div className="absolute inset-0 overflow-hidden">
                <Node />
                <Text />
            </div>
        </div>
    );
}
