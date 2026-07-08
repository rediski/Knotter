import { useState, useCallback, useRef, useEffect } from 'react';
import { Position } from '@/_core/_/canvas.types';

export const useContextMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, closeMenu]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, closeMenu]);

    return {
        isOpen,
        position,
        menuRef,
        handleContextMenu,
        closeMenu,
        openMenu,
    };
};
