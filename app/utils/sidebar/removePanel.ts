import type { SidebarPanel } from '@/_core/_/sidebarPanel';

export const removePanel = (
    sidebarPanels: SidebarPanel[],
    setSidebarPanels: (panels: SidebarPanel[]) => void,
    panelId: string,
) => {
    if (sidebarPanels.length <= 1) return;
    setSidebarPanels(sidebarPanels.filter((panel) => panel.id !== panelId));
};
