import { RefObject } from 'react';
import { Position } from '@/_core/_/canvas.types';

export function getCanvasCenter(canvasRef: RefObject<HTMLCanvasElement | null>): Position | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
        x: rect.width / 2,
        y: rect.height / 2,
    };
}
