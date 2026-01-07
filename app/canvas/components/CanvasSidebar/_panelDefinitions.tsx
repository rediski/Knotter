import { JSX } from 'react';

import { Hierarchy } from '@/canvas/components/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/components/Inspector/Inspector';
import { Parameters } from '@/canvas/components/Parameters/_core/Parameters';

import type { PanelType } from '@/canvas/components/CanvasSidebar/_sidebarPanel.types';

import { ListTree, Info, Variable, type LucideIcon } from 'lucide-react';

export interface PanelDefinition {
    label: string;
    icon: LucideIcon;
    component: JSX.Element;
}

export const panelDefinitions: Record<PanelType, PanelDefinition> = {
    hierarchy: {
        label: 'Иерархия',
        icon: ListTree,
        component: <Hierarchy />,
    },
    inspector: {
        label: 'Инспектор',
        icon: Info,
        component: <Inspector />,
    },
    parameters: {
        label: 'Параметры',
        icon: Variable,
        component: <Parameters />,
    },
};
