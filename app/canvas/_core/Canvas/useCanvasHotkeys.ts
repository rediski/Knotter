'use client';

import { useEffect, RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { undo, redo } from '@/canvas/utils/clipboard/historyManager';

import { toggleTooltipMode } from '@/canvas/utils/canvas/toggleTooltipMode';
import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';
import { selectAll } from '@/canvas/utils/items/selectAll';
import { copySelectedItems, pasteClipboardItems } from '@/canvas/utils/clipboard/copyPasteItems';
import { createNode } from '@/canvas/utils/nodes/createNode';
import { createText } from '@/canvas/utils/texts/createText';
import { initEdge } from '@/canvas/utils/edges/initEdge';

export function useCanvasHotkeys(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useCanvasStore.getState().setSelectedEdgeIds;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    const toggleGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleAxes = useCanvasStore((state) => state.toggleShowAxes);

    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const keysPressed = new Set<string>();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;

            const key = e.key.toLowerCase();
            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            const isCtrl = e.ctrlKey || e.metaKey;

            if (keysPressed.has(key)) return;

            keysPressed.add(key);

            if (key === 'escape') {
                const hasSelectedItems = useCanvasStore.getState().selectedItemIds.length > 0;
                const hasSelectedEdges = useCanvasStore.getState().selectedEdgeIds.length > 0;
                const hasTempEdge = useCanvasStore.getState().tempEdge !== null;

                if (hasSelectedItems) {
                    setSelectedItemIds([]);
                }

                if (hasSelectedEdges) {
                    setSelectedEdgeIds([]);
                }

                if (hasTempEdge) {
                    setTempEdge(null);
                }

                return;
            }

            const toggleMap: Record<string, () => void> = {
                t: () => toggleTooltipMode(),
                е: () => toggleTooltipMode(),
                m: () => toggleMagnetMode(),
                ь: () => toggleMagnetMode(),
                g: () => toggleGrid(),
                п: () => toggleGrid(),
                a: () => toggleAxes(),
                ф: () => toggleAxes(),
            };

            if (!isCtrl && !e.shiftKey && toggleMap[key]) {
                return toggleMap[key]();
            }

            if (key === 'delete') return deleteSelectedItems();

            if (isCtrl) {
                const ctrlMap: Record<string, () => void> = {
                    a: () => selectAll(),
                    ф: () => selectAll(),
                    c: () => copySelectedItems(items, selectedItemIds),
                    с: () => copySelectedItems(items, selectedItemIds),
                    v: () => pasteClipboardItems(),
                    м: () => pasteClipboardItems(),
                    z: () => (e.shiftKey ? redo() : undo()),
                    я: () => (e.shiftKey ? redo() : undo()),
                };

                if (ctrlMap[key]) {
                    e.preventDefault();
                    return ctrlMap[key]();
                }
            }

            if (e.shiftKey) {
                if (key === 'a' || key === 'ф') return createNode();
                if (key === 't' || key === 'е') return createText();
                if (key === 'e' || key === 'у') return initEdge();
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keysPressed.delete(e.key.toLowerCase());
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [canvasRef, setSelectedItemIds]);
}
