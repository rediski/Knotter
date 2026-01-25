'use client';

import { createElement, JSX } from 'react';

import type { PanelType } from '@/canvas/_core/_/sidebarPanel.types';

import { Hierarchy } from '@/canvas/CanvasSidebar/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/CanvasSidebar/Inspector/Inspector';
import { Parameters } from '@/canvas/CanvasSidebar/Parameters/core/Parameters';

import { ListTree, Settings, Braces, type LucideIcon } from 'lucide-react';

export interface PanelDefinition {
    label: string;
    icon: LucideIcon;
    component: (props: { panelId: string }) => JSX.Element;
}

export const panelDefinitions: Record<PanelType, PanelDefinition> = {
    hierarchy: {
        label: 'Иерархия',
        icon: ListTree,
        component: ({ panelId }) => createElement(Hierarchy, { panelId }),
    },
    inspector: {
        label: 'Инспектор',
        icon: Settings,
        component: ({ panelId }) => createElement(Inspector, { panelId }),
    },
    parameters: {
        label: 'Параметры',
        icon: Braces,
        component: ({ panelId }) => createElement(Parameters, { panelId }),
    },
};
