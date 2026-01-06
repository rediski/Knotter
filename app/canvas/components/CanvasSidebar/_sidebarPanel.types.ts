export type PanelType = 'hierarchy' | 'inspector' | 'parameters';

export interface SidebarPanel {
    id: string;
    type: PanelType | null;
    height: number;
}
