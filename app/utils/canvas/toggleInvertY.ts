import { useCanvasStore } from '@/store/useCanvasStore';

export function toggleInvertY() {
    useCanvasStore.setState((state) => ({
        invertY: !state.invertY,
    }));
}
