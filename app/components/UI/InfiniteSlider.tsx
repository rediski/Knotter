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
    const containerRef = useRef<HTMLDivElement>(null);

    const [displayValue, setDisplayValue] = useState(value);

    const precision = useMemo(() => {
        const stepStr = step.toString();

        return stepStr.includes('.') ? stepStr.length - stepStr.indexOf('.') - 1 : 0;
    }, [step]);

    const precisionFactor = useMemo(() => Math.pow(10, precision), [precision]);

    const sensitivity = useMemo(() => {
        return PIXELS_PER_VALUE_CHANGE / step;
    }, [step]);

    useEffect(() => {
        if (!draggingRef.current) {
            setDisplayValue(value);
        }
    }, [value]);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!draggingRef.current) return;

            const totalPixelDelta = e.clientX - startXRef.current;
            const valueDelta = totalPixelDelta / sensitivity;
            const newValue = startValueRef.current + valueDelta;

            const steppedValue = Math.round(newValue / step) * step;
            const clampedValue = Math.round(steppedValue * precisionFactor) / precisionFactor;

            const finalValue = Math.max(min, Math.min(max, clampedValue));

            setDisplayValue(finalValue);

            if (finalValue !== value) {
                onChange(finalValue);
            }

            if ((finalValue === max && newValue > max) || (finalValue === min && newValue < min)) {
                startXRef.current = e.clientX;
                startValueRef.current = finalValue;
            }
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
            e.stopPropagation();

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
        <div ref={containerRef} className="flex justify-end gap-2 items-center select-none w-full">
            <div
                onMouseDown={handleMouseDown}
                data-interactive-element="true"
                className={`
                    relative w-full  h-8 px-2 flex items-center justify-between cursor-ew-resize text-sm rounded-md select-none
                    ${showFill && 'overflow-hidden'}
                    ${className}
                `}
            >
                {showFill && (
                    <div className="absolute left-0 top-0 h-full bg-bg-accent" style={{ width: `${fillPercentage}%` }} />
                )}

                <span className="relative text-foreground truncate mr-2">{name}</span>

                <span className="relative text-foreground whitespace-nowrap tabular-nums min-w-[8ch] text-right">
                    {formatDisplayValue}
                </span>
            </div>
        </div>
    );
});
