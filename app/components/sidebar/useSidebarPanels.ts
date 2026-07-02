'use client';

import { v4 as uuid } from 'uuid';
import { useSidebarStore } from '@/store/useSidebarStore';
import { SidebarPanel } from '@/_core/_/sidebarPanel';

export const useSidebarPanels = () => {
    const sidebarPanels = useSidebarStore((state) => state.sidebarPanels);
    const setSidebarPanels = useSidebarStore((state) => state.setSidebarPanels);

    const addPanel = () => {
        const newPanel: SidebarPanel = { id: uuid(), type: null };
        setSidebarPanels([...sidebarPanels, newPanel]);
    };

    const removePanel = (id: string) => setSidebarPanels(sidebarPanels.filter((panel) => panel.id !== id));

    const setPanelType = (id: string, type: SidebarPanel['type']) => {
        setSidebarPanels(sidebarPanels.map((panel) => (panel.id === id ? { ...panel, type } : panel)));
    };

    const movePanel = (dragIndex: number, hoverIndex: number) => {
        const newPanels = [...sidebarPanels];

        const [dragged] = newPanels.splice(dragIndex, 1);

        newPanels.splice(hoverIndex, 0, dragged);

        setSidebarPanels(newPanels);
    };

    const movePanelUp = (canMoveUp: boolean, index: number) => {
        if (canMoveUp) movePanel(index, index - 1);
    };

    const movePanelDown = (canMoveDown: boolean, index: number) => {
        if (canMoveDown) movePanel(index, index + 1);
    };

    return {
        addPanel,
        removePanel,
        setPanelType,
        movePanelUp,
        movePanelDown,
    };
};
