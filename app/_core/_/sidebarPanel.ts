import { ListTree, History, Settings, Database, FileBracesCorner, Clipboard, ScanBox, type LucideIcon } from 'lucide-react';

export type PanelType = 'clipboard' | 'details' | 'hierarchy' | 'history' | 'inspector' | 'data' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    clipboard: 'Буфер обмена',
    details: 'Подробности',
    hierarchy: 'Иерархия',
    history: 'История',
    inspector: 'Инспектор',
    data: 'Данные',
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    clipboard: Clipboard,
    details: FileBracesCorner,
    hierarchy: ListTree,
    history: History,
    inspector: Settings,
    data: Database,
    parameters: ScanBox,
};
