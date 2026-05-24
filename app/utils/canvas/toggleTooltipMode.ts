import { useCanvasStore } from '@/store/useCanvasStore';

export function toggleTooltipMode() {
    const tooltipMode = useCanvasStore.getState().tooltipMode;
    const setTooltipMode = useCanvasStore.getState().setTooltipMode;

    const modes = ['always', 'hover', 'never'] as const;
    const currentIndex = modes.indexOf(tooltipMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTooltipMode(modes[nextIndex]);
}
