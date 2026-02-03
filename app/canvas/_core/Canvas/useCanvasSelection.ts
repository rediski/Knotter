'use client';

import { useState, useCallback } from 'react';

import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getItemsInSelectionBox } from '@/canvas/utils/items/getItemsInSelectionBox';

export function useCanvasSelection() {
    const { setSelectedItemIds } = useCanvasStore();

    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);

    const selectItemsInArea = useCallback(
        (start: Position, end: Position) => {
            const items = useCanvasStore.getState().items;

            const selected = getItemsInSelectionBox(items, start, end);
            setSelectedItemIds(selected);
        },
        [setSelectedItemIds],
    );

    return { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, selectItemsInArea };
}
