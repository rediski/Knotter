'use client';

import { useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/useSidebarStore';

const MIN_WIDTH = 0;

export function useSidebarResize() {
    const setSidebarWidth = useSidebarStore((state) => state.setSidebarWidth);
    const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);

    const [isResizingSidebar, setIsResizingSidebar] = useState(false);

    useEffect(() => {
        if (!isResizingSidebar) return;

        const onMouseMove = (e: MouseEvent) => {
            const leftEdge = 0;
            const MAX_WIDTH = window.innerWidth - 64;

            const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - leftEdge));
            setSidebarWidth(newWidth);
        };

        const onMouseUp = () => {
            setIsResizingSidebar(false);
            document.body.style.cursor = '';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isResizingSidebar, setSidebarWidth]);

    const startSidebarResize = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingSidebar(true);
        document.body.style.cursor = 'ew-resize';
    };

    return {
        width: sidebarWidth,
        isResizingSidebar,
        startSidebarResize,
    };
}
