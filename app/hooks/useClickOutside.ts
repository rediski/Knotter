import { useEffect, RefObject, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, onClose: () => void) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onCloseRef.current();
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onCloseRef.current();
            }
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref]);
}
