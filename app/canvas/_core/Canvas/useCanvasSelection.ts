'use client';

import { useRef, useCallback } from 'react';

import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getItemsInSelectionBox } from '@/canvas/utils/items/getItemsInSelectionBox';

export function useCanvasSelection() {
    const { setSelectedItemIds } = useCanvasStore();

    const selectionStartRef = useRef<Position | null>(null);
    const selectionEndRef = useRef<Position | null>(null);

    const setSelectionStart = (pos: Position | null) => {
        selectionStartRef.current = pos;
    };

    const setSelectionEnd = (pos: Position | null) => {
        selectionEndRef.current = pos;
    };

    const selectItemsInBox = useCallback(
        (start: Position, end: Position) => {
            const items = useCanvasStore.getState().items;

            const selected = getItemsInSelectionBox(items, start, end);
            setSelectedItemIds(selected);
        },
        [setSelectedItemIds],
    );

    return { selectionStartRef, selectionEndRef, setSelectionStart, setSelectionEnd, selectItemsInBox };
}
