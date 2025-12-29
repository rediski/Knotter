'use client';

import { useState, useCallback } from 'react';

import type { Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getItemsInSelectionArea } from '@/canvas/utils/items/getItemsInSelectionArea';

export function useCanvasSelection() {
    const { setSelectedItemIds } = useCanvasStore();

    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);

    const selectItemsInArea = useCallback(
        (start: Position, end: Position) => {
            const items = useCanvasStore.getState().items;

            const selectableItems = items.filter((item) => item.kind !== 'edge');

            const selected = getItemsInSelectionArea(selectableItems, start, end);
            setSelectedItemIds(selected);
        },
        [setSelectedItemIds],
    );

    return { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, selectItemsInArea };
}
