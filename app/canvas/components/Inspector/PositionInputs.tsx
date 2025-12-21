'use client';

import { memo } from 'react';

import { InfiniteSlider } from '@/components/UI/InfiniteSlider';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NODE_MOVE_MAX_STEP, NODE_MOVE_MIN_STEP } from '@/canvas/canvas.constants';

interface PositionInputsProps {
    positionX: number;
    positionY: number;
    onMove: (axis: 'x' | 'y', value: number) => void;
}

export const PositionInputs = memo(function PositionInputs({ positionX, positionY, onMove }: PositionInputsProps) {
    const isMagnet = useCanvasStore((state) => state.isMagnet);

    return (
        <>
            <InfiniteSlider
                name="Положение X"
                min={-Infinity}
                max={Infinity}
                value={positionX}
                step={isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP}
                onChange={(value) => onMove('x', value)}
                className="bg-depth-3 hover:bg-depth-4 active:bg-depth-5"
            />

            <InfiniteSlider
                name="Положение Y"
                min={-Infinity}
                max={Infinity}
                value={positionY}
                step={isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP}
                onChange={(value) => onMove('y', value)}
                className="bg-depth-3 hover:bg-depth-4 active:bg-depth-5"
            />
        </>
    );
});
