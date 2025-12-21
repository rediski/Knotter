import { useState, useCallback } from 'react';
import { Position } from '@/canvas/canvas.types';

export const useContextMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    const openMenu = useCallback((x: number, y: number) => {
        setPosition({ x, y });
        setIsOpen(true);
    }, []);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleContextMenu = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            openMenu(event.clientX, event.clientY);
        },
        [openMenu],
    );

    return { isOpen, position, handleContextMenu, closeMenu };
};
