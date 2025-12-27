'use client';

import { memo, useRef, useCallback, useMemo, useState, useEffect } from 'react';

type InfiniteSliderProps = {
    value: number;
    step?: number;
    min?: number;
    max?: number;
    name?: string;
    showFill?: boolean;
    className?: string;
    onChange: (value: number) => void;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const PIXELS_PER_VALUE_CHANGE = 10;

export const InfiniteSlider = memo(function InfiniteSliderInput({
    value,
    step = 1,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    name,
    showFill = false,
    className = '',
    onChange,
}: InfiniteSliderProps) {
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const startValueRef = useRef(0);

    const [displayValue, setDisplayValue] = useState(value);

    const precision = useMemo(() => {
        const stepStr = step.toString();

        return stepStr.includes('.') ? stepStr.length - stepStr.indexOf('.') - 1 : 0;
    }, [step]);

    const precisionFactor = useMemo(() => Math.pow(10, precision), [precision]);

    const sensitivity = useMemo(() => PIXELS_PER_VALUE_CHANGE / step, [step]);

    useEffect(() => {
        if (!draggingRef.current) setDisplayValue(value);
    }, [value]);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!draggingRef.current) return;

            const dx = e.clientX - startXRef.current;
            const valueDelta = dx / sensitivity;
            const newValue = startValueRef.current + valueDelta;

            const stepped = Math.round(newValue / step) * step;
            const clamped = Math.round(stepped * precisionFactor) / precisionFactor;

            const finalValue = Math.max(min, Math.min(max, clamped));

            setDisplayValue(finalValue);
            if (finalValue !== value) onChange(finalValue);
        },
        [onChange, step, min, max, sensitivity, precisionFactor, value],
    );

    const handleMouseUp = useCallback(() => {
        draggingRef.current = false;

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();

            draggingRef.current = true;

            startXRef.current = e.clientX;
            startValueRef.current = displayValue;

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [handleMouseMove, handleMouseUp, displayValue],
    );

    const formatDisplayValue = useMemo(() => {
        const formatted = displayValue.toFixed(precision);

        return parseFloat(formatted).toString();
    }, [displayValue, precision]);

    const fillPercentage = Math.max(0, Math.min(100, ((displayValue - min) / (max - min)) * 100));

    return (
        <div className="flex w-full select-none">
            <div
                data-interactive-element="true"
                onMouseDown={handleMouseDown}
                className={`
                    relative w-full h-8 px-3 flex items-center justify-between
                    cursor-ew-resize text-sm rounded-md
                    ${showFill ? 'overflow-hidden' : ''}
                    ${className}
                `}
            >
                {showFill && (
                    <div className="absolute inset-y-0 left-0 bg-bg-accent" style={{ width: `${fillPercentage}%` }} />
                )}

                <div className="relative z-10 w-full flex items-center justify-between text-foreground">
                    <span className="truncate mr-2">{name}</span>
                    <span className="tabular-nums min-w-[8ch] text-right">{formatDisplayValue}</span>
                </div>

                {showFill && (
                    <div
                        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-3 text-white"
                        style={{
                            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                        }}
                    >
                        <span className="truncate mr-2">{name}</span>
                        <span className="tabular-nums min-w-[8ch] text-right">{formatDisplayValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
