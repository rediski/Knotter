'use client';

import { useRef, useCallback, useMemo } from 'react';

import type { SidebarPanel, PanelType } from '@/canvas/_core/_/sidebarPanel.types';

import { Hierarchy } from '@/canvas/CanvasSidebar/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/CanvasSidebar/Inspector/Inspector';
import { Parameters } from '@/canvas/CanvasSidebar/Parameters/Parameters';
import { useSidebarPanels } from '@/canvas/CanvasSidebar/useSidebarPanels';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { ListTree, Settings, Braces, type LucideIcon } from 'lucide-react';

const panelComponents = {
    hierarchy: Hierarchy,
    inspector: Inspector,
    parameters: Parameters,
};

const panelTitles: Record<PanelType, string> = {
    hierarchy: 'Иерархия',
    inspector: 'Инспектор',
    parameters: 'Параметры',
};

const panelIcons: Record<PanelType, LucideIcon> = {
    hierarchy: ListTree,
    inspector: Settings,
    parameters: Braces,
};

export function useSidebarPanel(panel: SidebarPanel) {
    const panelRef = useRef<HTMLDivElement>(null);

    const { setPanelType } = useSidebarPanels();

    const sidebarPanels = useCanvasStore((state) => state.sidebarPanels);
    const filterText = useCanvasStore((state) => state.filterText[panel.id] || '');
    const setFilterText = useCanvasStore((state) => state.setFilterText);

    const PanelComponent = panel.type ? panelComponents[panel.type] : null;
    const currentPanelTitle = panel.type ? panelTitles[panel.type] : 'Пустая панель';
    const currentPanelIcon = panel.type ? panelIcons[panel.type] : undefined;

    const panelIndex = sidebarPanels.findIndex((p) => p.id === panel.id);

    const panelOptions = useMemo(
        () =>
            Object.entries(panelTitles).map(([key, label]) => ({
                value: key as PanelType,
                label,
                icon: panelIcons[key as PanelType],
            })),
        [],
    );

    const handleSelect = useCallback(
        (value: PanelType) => {
            setPanelType(panel.id, value);
            setFilterText(panel.id, '');
        },
        [panel.id, setPanelType, setFilterText],
    );

    const handleFilterChange = useCallback(
        (value: string) => {
            setFilterText(panel.id, value);
        },
        [panel.id, setFilterText],
    );

    return {
        panelRef,

        filterText,
        PanelComponent,
        panelOptions,
        currentPanelTitle,
        currentPanelIcon,
        panelIndex,

        handleSelect,
        handleFilterChange,
    };
}
