import type { CanvasAction } from '@/_core/_/history.types';
import { useHistoryStore } from '@/store/useHistoryStore';
import { restoreCanvasFromHistory } from '@/utils/history/restoreCanvasFromHistory';

export const MAX_HISTORY_SIZE = 100;

export function addToHistory(action: CanvasAction) {
    const historyState = useHistoryStore.getState();

    const history = historyState.history;
    const setHistory = historyState.setHistory;

    const historyPosition = historyState.historyPosition;
    const setHistoryPosition = historyState.setHistoryPosition;

    let newHistory = [...history.slice(0, historyPosition + 1), structuredClone(action)];

    if (newHistory.length > MAX_HISTORY_SIZE) {
        const excess = newHistory.length - MAX_HISTORY_SIZE;
        newHistory = newHistory.slice(excess);

        const newPosition = historyPosition + 1 - excess;
        setHistoryPosition(newPosition);
        setHistory(newHistory);
    }

    if (newHistory.length <= MAX_HISTORY_SIZE) {
        setHistory(newHistory);
        setHistoryPosition(historyPosition + 1);
    }
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
