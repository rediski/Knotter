'use client';

import { useEffect, RefObject } from 'react';
import { useRouter } from 'next/navigation';

import { useCanvasStore } from '@/store/useCanvasStore';
import { useItemsStore } from '@/store/useItemsStore';
import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

import { undo, redo } from '@/utils/history/historyManager';

import { toggleTooltipMode } from '@/utils/canvas/toggleTooltipMode';
import { toggleMagnetMode } from '@/utils/canvas/toggleMagnetMode';
import { toggleInvertY } from '@/utils/canvas/toggleInvertY';
import { clearSelection } from '@/utils/canvas/сlearSelection';

import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';
import { selectAllItems } from '@/utils/items/selectAllItems';

import { selectAllNodes } from '@/utils/nodes/selectAllNodes';
import { createNode } from '@/utils/nodes/createNode';
import { openNodeTab } from '@/utils/nodes/openNodeTab';
import { getSelectedNodesIds } from '@/utils/nodes/getSelectedNodes';

import { selectAllEdges } from '@/utils/edges/selectAllEdges';
import { initEdge } from '@/utils/edges/initEdge';

import { copySelectedItems, pasteClipboardItems } from '@/utils/clipboard/copyPasteItems';

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
        const { scenes, currentSceneId, selectedItemIds } = useItemsStore.getState();
        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];
        copySelectedItems(items, selectedItemIds);
    },
    с: () => {
        const { scenes, currentSceneId, selectedItemIds } = useItemsStore.getState();
        const scene = currentSceneId ? scenes[currentSceneId] : null;
        const items = scene?.items ?? [];
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
    y: toggleInvertY,
    н: toggleInvertY,
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
    const router = useRouter();

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
                const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();
                const scene = currentSceneId ? scenes[currentSceneId] : null;
                const items = scene?.items ?? [];
                const selectedNodesIds = getSelectedNodesIds({ items, selectedItemIds });

                if (selectedNodesIds.length > 0) {
                    openNodeTab(selectedNodesIds[0], router);
                }

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
