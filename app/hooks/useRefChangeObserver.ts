import { useEffect, useReducer, useRef } from 'react';

export const useRefChangeObserver = <T>(targetRef: React.RefObject<T>, dependencies: React.DependencyList = []) => {
    const [, triggerRerender] = useReducer((counter) => counter + 1, 0);
    const animationFrameRef = useRef<number | null>(null);
    const previousRefValueRef = useRef<T | null>(targetRef.current);

    useEffect(() => {
        const scheduleUpdate = () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                if (previousRefValueRef.current !== targetRef.current) {
                    previousRefValueRef.current = targetRef.current;
                    triggerRerender();
                }

                animationFrameRef.current = null;
            });
        };

        const handleMouseMove = () => {
            scheduleUpdate();
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [targetRef, ...dependencies]);

    return triggerRerender;
};
