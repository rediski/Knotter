'use client';

import { useEffect, RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';

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

export function useCanvasHotkeys(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const toggleGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleAxes = useCanvasStore((state) => state.toggleShowAxes);

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
            const isShift = e.shiftKey;
            const isEnter = e.code === 'Enter';

            if (keysPressed.has(key)) return;

            keysPressed.add(key);

            if (isCtrl && isShift) {
                const ctrlShiftMap: Record<string, () => void> = {
                    a: () => selectAllItems(),
                    ф: () => selectAllItems(),
                    z: () => redo(),
                    я: () => redo(),
                };

                if (ctrlShiftMap[key]) {
                    e.preventDefault();
                    return ctrlShiftMap[key]();
                }
            }

            if (isCtrl && !isShift) {
                const ctrlMap: Record<string, () => void> = {
                    a: selectAllNodes,
                    ф: selectAllNodes,
                    e: selectAllEdges,
                    у: selectAllEdges,
                    c: () => {
                        const itemsState = useItemsStore.getState();
                        copySelectedItems(itemsState.items, itemsState.selectedItemIds);
                    },
                    с: () => {
                        const itemsState = useItemsStore.getState();
                        copySelectedItems(itemsState.items, itemsState.selectedItemIds);
                    },
                    v: pasteClipboardItems,
                    м: pasteClipboardItems,
                    z: undo,
                    я: undo,
                };

                if (ctrlMap[key]) {
                    e.preventDefault();
                    return ctrlMap[key]();
                }
            }

            if (isShift && !isCtrl) {
                if (key === 'a' || key === 'ф') return createNode();
                if (key === 'e' || key === 'у') return initEdge();
            }

            const toggleMap: Record<string, () => void> = {
                t: toggleTooltipMode,
                е: toggleTooltipMode,
                m: toggleMagnetMode,
                ь: toggleMagnetMode,
                g: toggleGrid,
                п: toggleGrid,
                a: toggleAxes,
                ф: toggleAxes,
            };

            if (!isCtrl && !isShift && toggleMap[key]) {
                e.preventDefault();
                return toggleMap[key]();
            }

            if (isEnter) {
                const itemsState = useItemsStore.getState();

                const items = itemsState.items;
                const selectedItemIds = itemsState.selectedItemIds;

                openTabs(
                    getSelectedNodesIds({
                        items,
                        selectedItemIds,
                    }),
                );

                return;
            }

            if (key === 'escape') {
                clearSelection();
                return;
            }

            if (key === 'delete') {
                return deleteSelectedItems();
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
    }, [canvasRef]);
}
