import { v4 as uuid } from 'uuid';
import { useCanvasStore } from '../store/canvasStore';
import { SidebarPanel } from '../components/CanvasSidebar/_sidebarPanel.types';

export const useSidebarPanels = () => {
    const sidebarPanels = useCanvasStore((state) => state.sidebarPanels);
    const setSidebarPanels = useCanvasStore((state) => state.setSidebarPanels);

    const addPanel = () => {
        const newPanel: SidebarPanel = { id: uuid(), type: null, height: 100 };
        setSidebarPanels([...sidebarPanels, newPanel]);
    };

    const removePanel = (id: string) => setSidebarPanels(sidebarPanels.filter((panel) => panel.id !== id));

    const setPanelType = (id: string, type: SidebarPanel['type']) => {
        setSidebarPanels(sidebarPanels.map((panel) => (panel.id === id ? { ...panel, type } : panel)));
    };

    const movePanel = (dragIndex: number, hoverIndex: number) => {
        const [dragged] = [...sidebarPanels].splice(dragIndex, 1);
        [...sidebarPanels].splice(hoverIndex, 0, dragged);

        setSidebarPanels([...sidebarPanels]);
    };

    return {
        sidebarPanels,
        addPanel,
        removePanel,
        setPanelType,
        movePanel,
    };
};
