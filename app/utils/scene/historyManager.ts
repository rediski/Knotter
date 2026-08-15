import { MAX_HISTORY_SIZE, type CanvasAction } from '@/_core/_/history.types';
import { useItemsStore } from '@/store/useItemsStore';
import { restoreCanvasFromHistory } from '@/utils/scene/restoreCanvasFromHistory';

export function addToHistory(action: CanvasAction) {
    const itemsState = useItemsStore.getState();
    const { scenes, currentSceneId } = itemsState;

    if (!currentSceneId) {
        console.warn('No active scene for history');
        return;
    }

    const currentScene = scenes[currentSceneId];

    if (!currentScene) return;

    const { history, historyPosition } = currentScene;

    let newHistory = [...history.slice(0, historyPosition + 1), structuredClone(action)];

    let newPosition = historyPosition + 1;

    if (newHistory.length > MAX_HISTORY_SIZE) {
        const excess = newHistory.length - MAX_HISTORY_SIZE;
        newHistory = newHistory.slice(excess);
        newPosition = historyPosition + 1 - excess;
    }

    const updatedScene = {
        ...currentScene,
        history: newHistory,
        historyPosition: newPosition,
        updatedAt: new Date(),
    };

    useItemsStore.setState({
        scenes: {
            ...scenes,
            [currentSceneId]: updatedScene,
        },
    });
}

export function getHistoryUpToCurrent() {
    const itemsState = useItemsStore.getState();
    const { scenes, currentSceneId } = itemsState;

    if (!currentSceneId) {
        return [];
    }

    const currentScene = scenes[currentSceneId];

    if (!currentScene) {
        return [];
    }

    const { history, historyPosition } = currentScene;

    return history.slice(0, historyPosition + 1);
}

export function undo() {
    const itemsState = useItemsStore.getState();
    const { scenes, currentSceneId, setScenes } = itemsState;

    if (!currentSceneId) {
        return;
    }

    const currentScene = scenes[currentSceneId];
    if (!currentScene) {
        return;
    }

    const { historyPosition } = currentScene;

    if (historyPosition >= 0) {
        const updatedScene = {
            ...currentScene,
            historyPosition: historyPosition - 1,
            updatedAt: new Date(),
        };

        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });
    }

    restoreCanvasFromHistory(getHistoryUpToCurrent());
}

export function redo() {
    const itemsState = useItemsStore.getState();
    const { scenes, currentSceneId, setScenes } = itemsState;

    if (!currentSceneId) {
        return;
    }

    const currentScene = scenes[currentSceneId];

    if (!currentScene) {
        return;
    }

    const { history, historyPosition } = currentScene;

    if (historyPosition < history.length - 1) {
        const updatedScene = {
            ...currentScene,
            historyPosition: historyPosition + 1,
            updatedAt: new Date(),
        };

        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });
    }

    restoreCanvasFromHistory(getHistoryUpToCurrent());
}
