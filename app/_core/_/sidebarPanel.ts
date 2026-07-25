import { ListTree, History, Settings, Database, Clipboard, ScanBox, type LucideIcon } from 'lucide-react';

export type PanelType = 'clipboard' | 'data' | 'hierarchy' | 'history' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    clipboard: 'Буфер обмена',
    data: 'Данные',
    hierarchy: 'Иерархия',
    history: 'История',
    inspector: 'Инспектор',
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    clipboard: Clipboard,
    data: Database,
    hierarchy: ListTree,
    history: History,
    inspector: Settings,
    parameters: ScanBox,
};
