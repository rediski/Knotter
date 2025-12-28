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

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const items = useCanvasStore((s) => s.items);
    const selectedItemIds = useCanvasStore((s) => s.selectedItemIds);
    const hoveredNodeId = useCanvasStore((s) => s.hoveredNodeId);

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

    const nodes = getNodes(items);

    return (
        <div ref={containerRef} className="flex h-screen relative select-none" onContextMenu={handleContextMenu}>
            <CanvasControls />

            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} />

            <canvas ref={canvasRef} className="absolute w-full h-full" />

            <CanvasNodes nodes={nodes} selectedNodeIds={selectedItemIds} hoveredNodeId={hoveredNodeId} />
            <CanvasTexts />
        </div>
    );
}
