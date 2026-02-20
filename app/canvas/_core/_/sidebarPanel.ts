import { ListTree, Settings, Braces, FileBracesCorner, Clipboard, type LucideIcon } from 'lucide-react';

export type PanelType = 'details' | 'hierarchy' | 'history' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}

export const panelTitles: Record<PanelType, string> = {
    details: 'Подробности',
    hierarchy: 'Иерархия',
    history: 'История',
    inspector: 'Инспектор',
    parameters: 'Параметры',
};

export const panelIcons: Record<PanelType, LucideIcon> = {
    details: FileBracesCorner,
    hierarchy: ListTree,
    history: Clipboard,
    inspector: Settings,
    parameters: Braces,
};
