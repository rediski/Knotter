'use client';

import { useEffect, RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

import { undo, redo } from '@/canvas/utils/history/historyManager';

import { toggleTooltipMode } from '@/canvas/utils/canvas/toggleTooltipMode';
import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';
import { selectAllItems } from '@/canvas/utils/items/selectAllItems';
import { selectAllNodes } from '@/canvas/utils/nodes/selectAllNodes';
import { selectAllEdges } from '@/canvas/utils/edges/selectAllEdges';
import { copySelectedItems, pasteClipboardItems } from '@/canvas/utils/clipboard/copyPasteItems';
import { createNode } from '@/canvas/utils/nodes/createNode';

import { initEdge } from '@/canvas/utils/edges/initEdge';
import { clearSelection } from '@/canvas/utils/canvas/сlearSelection';
import { openTabs } from '@/canvas/utils/canvas/openTabs';
import { getSelectedNodesIds } from '@/canvas/utils/nodes/getSelectedNodes';
import { useItemsStore } from '@/canvas/store/useItemsStore';

const CTRL_SHIFT_MAP: Record<string, () => void> = {
    a: selectAllItems,
    ф: selectAllItems,
    z: redo,
    я: redo,
};

const CTRL_MAP: Record<string, () => void> = {
    a: selectAllNodes,
    ф: selectAllNodes,
    e: selectAllEdges,
    у: selectAllEdges,
    c: () => {
        const { items, selectedItemIds } = useItemsStore.getState();
        copySelectedItems(items, selectedItemIds);
    },
    с: () => {
        const { items, selectedItemIds } = useItemsStore.getState();
        copySelectedItems(items, selectedItemIds);
    },
    v: pasteClipboardItems,
    м: pasteClipboardItems,
    z: undo,
    я: undo,
};

const TOGGLE_MAP: Record<string, () => void> = {
    t: toggleTooltipMode,
    е: toggleTooltipMode,
    m: toggleMagnetMode,
    ь: toggleMagnetMode,
    g: () => useCanvasStore.getState().toggleShowGrid(),
    п: () => useCanvasStore.getState().toggleShowGrid(),
    a: () => useCanvasStore.getState().toggleShowAxes(),
    ф: () => useCanvasStore.getState().toggleShowAxes(),
};

const updateCursor = () => {
    const isSpacePressed = useCanvasRefsStore.getState().isSpacePressed.current;
    document.body.style.cursor = isSpacePressed ? 'grab' : '';
};

export function useCanvasHotkeys(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;

            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            const selection = window.getSelection();
            const hasSelectedText = selection && selection.toString().length > 0;

            const key = e.key.toLowerCase();
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isCopyPaste = key === 'c' || key === 'с' || key === 'v' || key === 'м';

            if (hasSelectedText && isCtrl && isCopyPaste) {
                return;
            }

            if (isCtrl && isShift && CTRL_SHIFT_MAP[key]) {
                e.preventDefault();
                CTRL_SHIFT_MAP[key]();
                return;
            }

            if (isCtrl && !isShift && CTRL_MAP[key]) {
                e.preventDefault();
                CTRL_MAP[key]();
                return;
            }

            if (isShift && !isCtrl && (key === 'a' || key === 'ф')) {
                e.preventDefault();
                createNode();
                return;
            }

            if (isShift && !isCtrl && (key === 'e' || key === 'у')) {
                e.preventDefault();
                initEdge();
                return;
            }

            if (!isCtrl && !isShift && TOGGLE_MAP[key]) {
                e.preventDefault();
                TOGGLE_MAP[key]();
                return;
            }

            if (e.code === 'Enter') {
                const { items, selectedItemIds } = useItemsStore.getState();
                openTabs(getSelectedNodesIds({ items, selectedItemIds }));
                return;
            }

            if (key === 'escape') {
                clearSelection();
                return;
            }

            if (key === 'delete') {
                deleteSelectedItems();
                return;
            }

            if (e.code === 'Space') {
                useCanvasRefsStore.getState().isSpacePressed.current = true;

                updateCursor();
                return;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                useCanvasRefsStore.getState().isSpacePressed.current = false;

                updateCursor();
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            const isSpacePressed = useCanvasRefsStore.getState().isSpacePressed.current;
            const shouldDragCanvas = e.button === 1 || (e.button === 0 && isSpacePressed);

            if (shouldDragCanvas) {
                e.preventDefault();
                document.body.style.cursor = 'grabbing';
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            const isSpacePressed = useCanvasRefsStore.getState().isSpacePressed.current;
            const shouldStopDragging = e.button === 1 || (e.button === 0 && isSpacePressed);

            if (shouldStopDragging) {
                updateCursor();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';

            const refsState = useCanvasRefsStore.getState();

            if (refsState.isSpacePressed?.current) {
                refsState.isSpacePressed.current = false;
            }
        };
    }, [canvasRef]);
}
