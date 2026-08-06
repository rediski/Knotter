import { ListTree, History, Settings, Clipboard, ScanBox, type LucideIcon } from 'lucide-react';

export type PanelType = 'clipboard' | 'hierarchy' | 'history' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    clipboard: 'Буфер обмена',
    hierarchy: 'Иерархия',
    history: 'История',
    inspector: 'Инспектор',
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    clipboard: Clipboard,
    hierarchy: ListTree,
    history: History,
    inspector: Settings,
    parameters: ScanBox,
};
