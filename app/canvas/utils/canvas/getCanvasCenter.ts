import { Position } from '@/canvas/_core/_/canvas.types';

export interface CanvasCenterOptions {
    offset: { x: number; y: number };
    zoomLevel: number;
    invertY: boolean;
}

export function getCanvasCenter(canvas: HTMLCanvasElement, options: CanvasCenterOptions): Position {
    const { offset, zoomLevel, invertY } = options;
    const rect = canvas.getBoundingClientRect();

    const centerX = (rect.width / 2 - offset.x) / zoomLevel;
    const centerY = invertY ? (rect.height / 2 - offset.y) / zoomLevel : (rect.height / 2 - offset.y) / zoomLevel;

    return { x: centerX, y: centerY };
}
