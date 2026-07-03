import type { SidebarPanel } from '@/_core/_/sidebarPanel';

export const setPanelType = (
    sidebarPanels: SidebarPanel[],
    setSidebarPanels: (panels: SidebarPanel[]) => void,
    id: string,
    type: SidebarPanel['type'],
) => {
    setSidebarPanels(sidebarPanels.map((panel) => (panel.id === id ? { ...panel, type } : panel)));
};
