import { RefObject } from 'react';

import type { Position } from '@/canvas/_core/_/canvas.types';

import { getMousePosition } from '@/canvas/utils/canvas/getMousePosition';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getTextIdUnderCursor } from '@/canvas/utils/texts/getTextIdUnderCursor';

export function getSelectionEventHandler(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    selectionStartRef: RefObject<Position | null>,
    setSelectionStart: (value: Position | null) => void,
    setSelectionEnd: (value: Position | null) => void,
    selectItemsInArea: (start: Position, end: Position) => void,
) {
    return {
        handleMouseDown(e: MouseEvent) {
            if (e.button !== 0) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            if (getNodeIdUnderCursor(e) !== null) return;
            if (getTextIdUnderCursor(e) !== null) return;

            const pos = getMousePosition(e, canvas);

            selectionStartRef.current = pos;

            setSelectionStart(pos);
            setSelectionEnd(pos);
        },

        handleMouseMove(e: MouseEvent) {
            const isLeftButtonPressed = (e.buttons & 1) === 1;

            if (!selectionStartRef.current || !isLeftButtonPressed) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const pos = getMousePosition(e, canvas);

            setSelectionEnd(pos);
            selectItemsInArea(selectionStartRef.current, pos);
        },

        handleMouseUp(e: MouseEvent) {
            const isNotLeftClick = e.button !== 0;

            if (!selectionStartRef.current || isNotLeftClick) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const pos = getMousePosition(e, canvas);

            selectItemsInArea(selectionStartRef.current, pos);

            selectionStartRef.current = null;

            setSelectionStart(null);
            setSelectionEnd(null);
        },
    };
}
