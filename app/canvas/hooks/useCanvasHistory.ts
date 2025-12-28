import { useRef } from 'react';

import type { CanvasState } from '@/canvas/canvas.types';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getTexts } from '@/canvas/utils/texts/getTexts';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { MAX_UNDO_STEPS } from '@/canvas/canvas.constants';

export function useCanvasHistory() {
    const historyRef = useRef<CanvasState[]>([]);
    const redoRef = useRef<CanvasState[]>([]);

    const pushHistory = () => {
        const state = useCanvasStore.getState();

        const snapshot = {
            nodes: getNodes(state.items),
            edges: getEdges(state.items),
            texts: getTexts(state.items),
        };

        const history = historyRef.current;
        if (history.length >= MAX_UNDO_STEPS) history.shift();

        history.push(snapshot);
        redoRef.current = [];
    };

    const undo = () => {
        const state = useCanvasStore.getState();
        const lastState = historyRef.current.pop();
        if (!lastState) return;

        redoRef.current.push({
            nodes: getNodes(state.items),
            edges: getEdges(state.items),
            texts: getTexts(state.items),
        });

        state.setItems([...lastState.nodes, ...lastState.edges]);
        state.setSelectedItemIds([]);
    };

    const redo = () => {
        const state = useCanvasStore.getState();
        const redoState = redoRef.current.pop();
        if (!redoState) return;

        historyRef.current.push({
            nodes: getNodes(state.items),
            edges: getEdges(state.items),
            texts: getTexts(state.items),
        });

        state.setItems([...redoState.nodes, ...redoState.edges]);
        state.setSelectedItemIds([]);
    };

    return { pushHistory, undo, redo };
}
