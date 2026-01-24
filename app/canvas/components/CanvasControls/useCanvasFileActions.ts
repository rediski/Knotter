import { useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useToast } from '@/components/UI/Toast';
import type { CanvasState } from '@/canvas/store/canvasStore';

const FILE_TYPES: FilePickerAcceptType[] = [
    {
        description: 'Knotter JSON',
        accept: { 'application/json': ['.knotter.json'] },
    },
];

export function useCanvasFileActions() {
    const setItems = useCanvasStore((state) => state.setItems);
    const setOffset = useCanvasStore((state) => state.setOffset);
    const setZoomLevel = useCanvasStore((state) => state.setZoomLevel);
    const setInvertY = useCanvasStore((state) => state.setInvertY);
    const setParameters = useCanvasStore((state) => state.setParameters);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setTooltipMode = useCanvasStore((state) => state.setTooltipMode);
    const setIsMagnet = useCanvasStore((state) => state.setIsMagnet);
    const setSidebarWidth = useCanvasStore((state) => state.setSidebarWidth);

    const { addToast } = useToast();

    const isFileSystemAccessSupported = useCallback(
        () => 'showOpenFilePicker' in window && 'showSaveFilePicker' in window,
        [],
    );

    const handleOpen = useCallback(async () => {
        try {
            let file: File | undefined;

            if (isFileSystemAccessSupported()) {
                const [fileHandle] = await showOpenFilePicker({
                    types: FILE_TYPES,
                    multiple: false,
                });

                file = await fileHandle.getFile();
            } else {
                const input = document.createElement('input');

                input.type = 'file';
                input.accept = '.knotter.json';
                input.style.display = 'none';

                document.body.appendChild(input);

                input.click();

                file = await new Promise<File | undefined>((resolve) => {
                    input.onchange = () => {
                        resolve(input.files?.[0] ?? undefined);
                        input.value = '';
                    };
                });

                document.body.removeChild(input);
            }

            if (!file) {
                addToast('Открытие файла отменено пользователем', 'info');
                return;
            }

            const fileContent = await file.text();
            const parsed = JSON.parse(fileContent) as Partial<CanvasState>;

            if (parsed.offset) setOffset(parsed.offset);
            if (parsed.zoomLevel !== undefined) setZoomLevel(parsed.zoomLevel);
            if (parsed.invertY !== undefined) setInvertY(parsed.invertY);

            if (Array.isArray(parsed.items)) {
                setItems(parsed.items);
            }

            if (Array.isArray(parsed.parameters)) setParameters(parsed.parameters);
            if (Array.isArray(parsed.selectedItemIds)) setSelectedItemIds(parsed.selectedItemIds);

            if (parsed.tooltipMode) setTooltipMode(parsed.tooltipMode);
            if (parsed.isMagnet !== undefined) setIsMagnet(parsed.isMagnet);
            if (parsed.sidebarWidth !== undefined) setSidebarWidth(parsed.sidebarWidth);

            localStorage.setItem('canvas-storage', JSON.stringify(parsed));

            addToast('Файл успешно загружен', 'success');
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                addToast('Открытие файла отменено пользователем', 'info');
            } else {
                addToast('Ошибка при открытии файла', 'error');
                console.error('File open error:', err);
            }
        }
    }, [
        addToast,
        setItems,
        setOffset,
        setZoomLevel,
        setInvertY,
        setParameters,
        setSelectedItemIds,
        setTooltipMode,
        setIsMagnet,
        setSidebarWidth,
        isFileSystemAccessSupported,
    ]);

    const handleSaveAs = useCallback(async () => {
        try {
            const currentState = useCanvasStore.getState();

            const stateToSave: Partial<CanvasState> = {
                offset: currentState.offset,
                zoomLevel: currentState.zoomLevel,
                invertY: currentState.invertY,
                items: currentState.items,
                parameters: currentState.parameters,
                selectedItemIds: currentState.selectedItemIds,
                selectedItem: currentState.selectedItem,
                tooltipMode: currentState.tooltipMode,
                isMagnet: currentState.isMagnet,
                showGrid: currentState.showGrid,
                showAxes: currentState.showAxes,
                sidebarWidth: currentState.sidebarWidth,
            };

            const blob = new Blob([JSON.stringify(stateToSave, null, 2)], {
                type: 'application/json',
            });

            if (isFileSystemAccessSupported()) {
                const fileHandle = await showSaveFilePicker({
                    suggestedName: 'canvas.knotter.json',
                    types: FILE_TYPES,
                });

                const writable = await fileHandle.createWritable();

                await writable.write(blob);
                await writable.close();
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.href = url;
                a.download = 'canvas.knotter.json';
                a.click();
                URL.revokeObjectURL(url);
            }

            addToast('Файл успешно сохранен', 'success');
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                addToast('Сохранение отменено пользователем', 'info');
            } else {
                addToast('Ошибка сохранения файла', 'error');
                console.error('File save error:', err);
            }
        }
    }, [addToast, isFileSystemAccessSupported]);

    return { handleOpen, handleSaveAs };
}
