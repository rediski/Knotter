import { v4 as uuid } from 'uuid';
import type { SidebarPanel } from '@/_core/_/sidebarPanel';

export const addPanel = (sidebarPanels: SidebarPanel[], setSidebarPanels: (panels: SidebarPanel[]) => void) => {
    const newPanel: SidebarPanel = { id: uuid(), type: null };
    setSidebarPanels([...sidebarPanels, newPanel]);
};
