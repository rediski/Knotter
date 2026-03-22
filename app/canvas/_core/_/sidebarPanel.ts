import { ListTree, History, Settings, Braces, FileBracesCorner, Clipboard, type LucideIcon } from 'lucide-react';

export type PanelType = 'clipboard' | 'details' | 'hierarchy' | 'history' | 'inspector' | 'parameters';

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
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    clipboard: Clipboard,
    details: FileBracesCorner,
    hierarchy: ListTree,
    history: History,
    inspector: Settings,
    parameters: Braces,
};
