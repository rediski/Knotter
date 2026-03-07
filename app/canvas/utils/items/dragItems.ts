import type { RefObject } from 'react';

import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { getSelectedItemsPositions } from '@/canvas/utils/items/getSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function startDragging(e: MouseEvent, canvasRef: RefObject<HTMLCanvasElement | null>) {
    if (!canvasRef.current) return;

    const mousePos = getMousePosition(e, canvasRef.current);

    const refsState = useCanvasRefsStore.getState();

    const isDragging = refsState.isDragging;
    const dragStartMouse = refsState.dragStartMouse;
    const initialNodePositions = refsState.initialNodePositions;

    dragStartMouse.current = mousePos;

    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const selectedItemIds = itemsState.selectedItemIds;

    initialNodePositions.current = getSelectedItemsPositions({ items, selectedItemIds });
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
