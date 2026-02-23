import { type RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

import { selectItemsInSelectionBox } from '@/canvas/utils/canvas/selectItemsInSelectionBox';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/canvas/utils/edges/getEdgeIdUnderCursor';
import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';

export function getSelectionEventHandler(canvasRef: RefObject<HTMLCanvasElement | null>) {
    return {
        handleMouseDown(e: MouseEvent) {
            if (e.button !== 0) return;

            const canvas = canvasRef.current;
            if (!findCanvasUnderCursor(e, canvas)) return;

            if (getNodeIdUnderCursor(e) !== null) return;
            if (getEdgeIdUnderCursor(e) !== null) return;

            const mousePos = useCanvasRefsStore.getState().mousePosition.current;
            const setSelectionStart = useCanvasStore.getState().setSelectionStart;
            const setSelectionEnd = useCanvasStore.getState().setSelectionEnd;

            setSelectionStart(mousePos);
            setSelectionEnd(mousePos);
        },

        handleMouseMove(e: MouseEvent) {
            const selectionStart = useCanvasStore.getState().selectionStart;
            const setSelectionEnd = useCanvasStore.getState().setSelectionEnd;

            const isLeftButtonPressed = (e.buttons & 1) === 1;

            if (!selectionStart || !isLeftButtonPressed) return;

            const canvas = canvasRef.current;
            if (!findCanvasUnderCursor(e, canvas)) return;

            const mousePos = useCanvasRefsStore.getState().mousePosition.current;

            setSelectionEnd(mousePos);
            selectItemsInSelectionBox(selectionStart, mousePos);
        },

        handleMouseUp(e: MouseEvent) {
            const selectionStart = useCanvasStore.getState().selectionStart;
            const setSelectionStart = useCanvasStore.getState().setSelectionStart;
            const setSelectionEnd = useCanvasStore.getState().setSelectionEnd;

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
