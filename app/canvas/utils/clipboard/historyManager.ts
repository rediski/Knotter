import type { CanvasAction } from '@/canvas/_core/_/clipboard.types';
import { restoreCanvasFromHistory } from '@/canvas/utils/clipboard/restoreCanvasFromHistory';

const history: CanvasAction[] = [];

let historyPosition = -1;

export function addToHistory(action: CanvasAction) {
    history.splice(historyPosition + 1);
    history.push(action);
    historyPosition++;
}

export function getHistoryUpToCurrent() {
    return history.slice(0, historyPosition + 1);
}

export function undo() {
    if (historyPosition >= 0) historyPosition--;
    restoreCanvasFromHistory(getHistoryUpToCurrent());
}

export function redo() {
    if (historyPosition < history.length - 1) historyPosition++;
    restoreCanvasFromHistory(getHistoryUpToCurrent());
}
