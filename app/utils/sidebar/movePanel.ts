import { SidebarPanel } from '@/_core/_/sidebarPanel';

export const movePanel = (
    sidebarPanels: SidebarPanel[],
    setSidebarPanels: (panels: SidebarPanel[]) => void,
    dragIndex: number,
    hoverIndex: number,
) => {
    const newPanels = [...sidebarPanels];

    const [dragged] = newPanels.splice(dragIndex, 1);

    newPanels.splice(hoverIndex, 0, dragged);

    setSidebarPanels(newPanels);
};

export const movePanelUp = (
    sidebarPanels: SidebarPanel[],
    setSidebarPanels: (panels: SidebarPanel[]) => void,
    canMoveUp: boolean,
    index: number,
) => {
    if (canMoveUp) movePanel(sidebarPanels, setSidebarPanels, index, index - 1);
};

export const movePanelDown = (
    sidebarPanels: SidebarPanel[],
    setSidebarPanels: (panels: SidebarPanel[]) => void,
    canMoveDown: boolean,
    index: number,
) => {
    if (canMoveDown) movePanel(sidebarPanels, setSidebarPanels, index, index + 1);
};
