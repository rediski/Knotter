import type { CanvasAction } from '@/canvas/_core/_/clipboard.types';
import { useHistoryStore } from '@/canvas/store/useHistoryStore';
import { restoreCanvasFromHistory } from '@/canvas/utils/clipboard/restoreCanvasFromHistory';

export function addToHistory(action: CanvasAction) {
    const historyState = useHistoryStore.getState();

    const history = historyState.history;
    const setHistory = historyState.setHistory;

    const historyPosition = historyState.historyPosition;
    const setHistoryPosition = historyState.setHistoryPosition;

    const newHistory = [...history.slice(0, historyPosition + 1), structuredClone(action)];

    setHistory(newHistory);
    setHistoryPosition(historyPosition + 1);
}

export function getHistoryUpToCurrent() {
    const historyState = useHistoryStore.getState();

    const history = historyState.history;
    const historyPosition = historyState.historyPosition;

    return history.slice(0, historyPosition + 1);
}

export function undo() {
    const historyState = useHistoryStore.getState();

    const historyPosition = historyState.historyPosition;
    const setHistoryPosition = historyState.setHistoryPosition;

    if (historyPosition >= 0) {
        setHistoryPosition(historyPosition - 1);
    }

    restoreCanvasFromHistory(getHistoryUpToCurrent());
}

export function redo() {
    const historyState = useHistoryStore.getState();

    const history = historyState.history;
    const historyPosition = historyState.historyPosition;
    const setHistoryPosition = historyState.setHistoryPosition;

    if (historyPosition < history.length - 1) {
        setHistoryPosition(historyPosition + 1);
    }

    restoreCanvasFromHistory(getHistoryUpToCurrent());
}
