import { type RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useCanvasRefsStore } from '@/canvas/store/useCanvasRefsStore';

import { selectItemsInSelectionBox } from '@/canvas/utils/canvas/selectItemsInSelectionBox';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/canvas/utils/edges/getEdgeIdUnderCursor';
import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function getSelectionEventHandler(canvasRef: RefObject<HTMLCanvasElement | null>) {
    return {
        handleMouseDown(e: MouseEvent) {
            if (e.button !== 0) return;

            const canvas = canvasRef.current;
            if (!findCanvasUnderCursor(e, canvas)) return;

            if (getNodeIdUnderCursor(e) !== null) return;
            if (getEdgeIdUnderCursor(e) !== null) return;

            const mousePos = useCanvasRefsStore.getState().mousePosition.current;

            const itemsStore = useItemsStore.getState();

            const setSelectionStart = itemsStore.setSelectionStart;
            const setSelectionEnd = itemsStore.setSelectionEnd;

            setSelectionStart(mousePos);
            setSelectionEnd(mousePos);
        },

        handleMouseMove(e: MouseEvent) {
            const itemsStore = useItemsStore.getState();

            const selectionStart = itemsStore.selectionStart;
            const setSelectionEnd = itemsStore.setSelectionEnd;

            const isLeftButtonPressed = (e.buttons & 1) === 1;

            if (!selectionStart || !isLeftButtonPressed) return;

            const canvas = canvasRef.current;
            if (!findCanvasUnderCursor(e, canvas)) return;

            const mousePos = useCanvasRefsStore.getState().mousePosition.current;

            setSelectionEnd(mousePos);
            selectItemsInSelectionBox(selectionStart, mousePos);
        },

        handleMouseUp(e: MouseEvent) {
            const itemsStore = useItemsStore.getState();

            const selectionStart = itemsStore.selectionStart;
            const setSelectionStart = itemsStore.setSelectionStart;
            const setSelectionEnd = itemsStore.setSelectionEnd;

            if (!selectionStart || e.button !== 0) return;

            const canvas = canvasRef.current;
            if (!findCanvasUnderCursor(e, canvas)) return;

            const mousePos = useCanvasRefsStore.getState().mousePosition.current;

            setSelectionEnd(mousePos);
            selectItemsInSelectionBox(selectionStart, mousePos);

            setSelectionStart(null);
            setSelectionEnd(null);
        },
    };
}
