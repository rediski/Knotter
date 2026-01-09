import { JSX } from 'react';

import { Hierarchy } from '@/canvas/components/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/components/Inspector/Inspector';
import { Parameters } from '@/canvas/components/Parameters/_core/Parameters';

import type { PanelType } from '@/canvas/components/CanvasSidebar/_sidebarPanel.types';

import { ListTree, Info, Variable, type LucideIcon } from 'lucide-react';

export interface PanelDefinition {
    label: string;
    icon: LucideIcon;
    component: (props: { panelId: string }) => JSX.Element;
}

export const panelDefinitions: Record<PanelType, PanelDefinition> = {
    hierarchy: {
        label: 'Иерархия',
        icon: ListTree,
        component: ({ panelId }) => <Hierarchy panelId={panelId} />,
    },
    inspector: {
        label: 'Инспектор',
        icon: Info,
        component: ({ panelId }) => <Inspector panelId={panelId} />,
    },
    parameters: {
        label: 'Параметры',
        icon: Variable,
        component: ({ panelId }) => <Parameters panelId={panelId} />,
    },
};
