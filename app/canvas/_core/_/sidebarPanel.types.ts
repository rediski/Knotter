export type PanelType = 'details' | 'hierarchy' | 'history' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
}
