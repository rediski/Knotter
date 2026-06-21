import type { RefObject } from 'react';

import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

import { getMousePosition } from '@/utils/canvas/getMousePosition';
import { getSelectedNodesPositions } from '@/utils/nodes/getSelectedNodes';
import { useItemsStore } from '@/store/useItemsStore';

export function startDragging(e: MouseEvent, canvasRef: RefObject<HTMLCanvasElement | null>) {
    if (!canvasRef.current) return;

    const mousePos = getMousePosition(e, canvasRef.current);

    const refsState = useCanvasRefsStore.getState();

    const isDragging = refsState.isDragging;
    const dragStartMouse = refsState.dragStartMouse;
    const initialNodePositions = refsState.initialNodePositions;

    dragStartMouse.current = mousePos;

    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    initialNodePositions.current = getSelectedNodesPositions();
    isDragging.current = false;
}

export function stopDragging() {
    const refsState = useCanvasRefsStore.getState();

    const isDragging = refsState.isDragging;
    const dragStartMouse = refsState.dragStartMouse;
    const initialNodePositions = refsState.initialNodePositions;

    isDragging.current = false;
    dragStartMouse.current = null;
    initialNodePositions.current = new Map();
}
