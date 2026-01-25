'use client';

import { useRef } from 'react';
import type { Position } from '@/canvas/_core/_/canvas.types';

export function useMousePosition() {
    const animationRef = useRef<number | null>(null);
    const currentPositionRef = useRef<Position>({ x: 0, y: 0 });

    const requestPositionUpdate = (callback: (pos: Position) => void) => {
        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(() => {
                callback(currentPositionRef.current);
                animationRef.current = null;
            });
        }
    };

    const trackMousePosition = (position: Position, callback: (pos: Position) => void) => {
        currentPositionRef.current = position;

        requestPositionUpdate(callback);
    };

    return { trackMousePosition };
}
