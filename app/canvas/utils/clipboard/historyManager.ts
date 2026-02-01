import type { CanvasAction } from '@/canvas/_core/_/clipboard.types';

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

export function moveBackInHistory() {
    if (historyPosition >= 0) historyPosition--;
}

export function moveForwardInHistory() {
    if (historyPosition < history.length - 1) historyPosition++;
}
