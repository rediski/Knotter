import { useState, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface UseSidebarResizeProps {
    minWidth: number;
    baseWidth: number;
    maxWidth: number;
    tabs: string[];
}

interface UseSidebarResizeReturn {
    width: number;
    isResizing: boolean;
    startResize: (e: React.MouseEvent) => void;
    open: boolean;
    openSidebar: (fromDrag?: boolean) => void;
    closeSidebar: () => void;
}

export default function useSidebarResize({
    minWidth,
    baseWidth,
    maxWidth,
    tabs,
}: UseSidebarResizeProps): UseSidebarResizeReturn {
    const sidebarWidth = useCanvasStore((state) => state.sidebarWidth);
    const setSidebarWidth = useCanvasStore((state) => state.setSidebarWidth);

    const activeTab = useCanvasStore((state) => state.activeTab);
    const setActiveTab = useCanvasStore((state) => state.setActiveTab);

    const [isResizing, setIsResizing] = useState(false);
    const [isOpen, setIsOpen] = useState(sidebarWidth > 0);

    const resizeRef = useRef(false);
    const currentWidthRef = useRef(sidebarWidth);
    const lastWidthRef = useRef(sidebarWidth > 0 ? sidebarWidth : baseWidth);
    const lastActiveTabRef = useRef(activeTab);

    const hasValidTab = useCallback(() => {
        return activeTab || lastActiveTabRef.current || tabs.length > 0;
    }, [activeTab, tabs.length]);

    const getRestoreWidth = useCallback(() => {
        return lastWidthRef.current > 0 ? lastWidthRef.current : baseWidth;
    }, [baseWidth]);

    const getDefaultTab = useCallback(() => {
        return lastActiveTabRef.current || tabs[0] || null;
    }, [tabs]);

    const openSidebar = useCallback(
        (fromDrag = false) => {
            if (!hasValidTab()) return;

            setIsOpen(true);

            if (!fromDrag && sidebarWidth === 0) {
                const restoreWidth = getRestoreWidth();
                setSidebarWidth(restoreWidth);
                currentWidthRef.current = restoreWidth;
            }

            if (!activeTab) {
                const defaultTab = getDefaultTab();

                if (defaultTab) {
                    setActiveTab(defaultTab);
                }
            }
        },
        [activeTab, getDefaultTab, getRestoreWidth, hasValidTab, setActiveTab, setSidebarWidth, sidebarWidth],
    );

    const closeSidebar = useCallback(() => {
        if (sidebarWidth > 0) {
            lastWidthRef.current = sidebarWidth;
        }

        if (activeTab) {
            lastActiveTabRef.current = activeTab;
        }

        setIsOpen(false);
        setSidebarWidth(0);
        setActiveTab(null);
    }, [activeTab, setActiveTab, setSidebarWidth, sidebarWidth]);

    const createResizeHandlers = (startX: number, startWidth: number) => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;

            const delta = startX - e.clientX;
            const newWidth = Math.min(Math.max(startWidth + delta, 0), maxWidth);

            currentWidthRef.current = newWidth;
            setSidebarWidth(newWidth);

            if (newWidth <= minWidth && isOpen) {
                closeSidebar();
                resizeRef.current = false;
            }
        };

        const handleMouseUp = () => {
            cleanupResize();

            const shouldCloseSidebar = currentWidthRef.current <= minWidth;
            const shouldSaveWidth = currentWidthRef.current > minWidth;

            if (shouldCloseSidebar) {
                closeSidebar();
            }

            if (shouldSaveWidth) {
                lastWidthRef.current = currentWidthRef.current;
            }
        };

        return { handleMouseMove, handleMouseUp };
    };

    const cleanupResize = () => {
        resizeRef.current = false;
        setIsResizing(false);
        document.documentElement.classList.remove('resizing');
    };

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isOpen && !hasValidTab()) return;

        if (!isOpen) {
            openSidebar(true);
        }

        const startX = e.clientX;
        const startWidth = sidebarWidth;

        resizeRef.current = true;
        setIsResizing(true);

        document.documentElement.classList.add('resizing');

        const { handleMouseMove, handleMouseUp } = createResizeHandlers(startX, startWidth);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    };

    return {
        width: Math.max(sidebarWidth, 1),
        isResizing,
        startResize,
        open: isOpen,
        openSidebar,
        closeSidebar,
    };
}
