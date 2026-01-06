import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

const MIN_WIDTH = 320;

export default function useSidebarResize() {
    const setSidebarWidth = useCanvasStore((s) => s.setSidebarWidth);
    const sidebarWidth = useCanvasStore((s) => s.sidebarWidth);

    const [isResizingSidebar, setIsResizingSidebar] = useState(false);

    useEffect(() => {
        if (!isResizingSidebar) return;

        const onMouseMove = (e: MouseEvent) => {
            const rightEdge = window.innerWidth;
            const MAX_WIDTH = rightEdge - 64;

            const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, rightEdge - e.clientX));
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
        startSidebarResize,
    };
}
