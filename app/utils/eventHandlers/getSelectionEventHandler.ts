import { type RefObject } from 'react';

import { useCanvasStore } from '@/store/useCanvasStore';
import { useCanvasRefsStore } from '@/store/useCanvasRefsStore';

import { selectItemsInSelectionBox } from '@/utils/canvas/selectItemsInSelectionBox';
import { getNodeIdUnderCursor } from '@/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/utils/edges/getEdgeIdUnderCursor';
import { findCanvasUnderCursor } from '@/utils/canvas/findCanvasUnderCursor';
import { useItemsStore } from '@/store/useItemsStore';

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
