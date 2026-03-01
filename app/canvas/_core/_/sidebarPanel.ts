import { ListTree, Settings, Braces, FileBracesCorner, Clipboard, type LucideIcon } from 'lucide-react';

export type PanelType = 'details' | 'hierarchy' | 'clipboard' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    clipboard: 'Буфер обмена',
    details: 'Подробности',
    hierarchy: 'Иерархия',
    inspector: 'Инспектор',
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    clipboard: Clipboard,
    details: FileBracesCorner,
    hierarchy: ListTree,
    inspector: Settings,
    parameters: Braces,
};
