import { ListTree, History, Settings, Clipboard, ScanBox, type LucideIcon } from 'lucide-react';

export type PanelType = 'hierarchy' | 'inspector' | 'parameters' | 'history' | 'clipboard';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    hierarchy: 'Иерархия',
    inspector: 'Инспектор',
    parameters: 'Параметры',
    history: 'История',
    clipboard: 'Буфер обмена',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    hierarchy: ListTree,
    inspector: Settings,
    parameters: ScanBox,
    history: History,
    clipboard: Clipboard,
};
