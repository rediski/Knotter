'use client';

import { useRef, useCallback, useMemo } from 'react';

import type { SidebarPanel as SidebarPanelType, PanelType } from '@/canvas/_core/_/sidebarPanel';

import { useSidebarPanels } from '@/canvas/components/sidebar/useSidebarPanels';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

import { panelTitles, panelIcons } from '@/canvas/_core/_/sidebarPanel';

export function useSidebarPanel(panel: SidebarPanelType) {
    const panelRef = useRef<HTMLDivElement>(null);

    const { setPanelType } = useSidebarPanels();

    const sidebarPanels = useCanvasStore((state) => state.sidebarPanels);
    const filterText = useCanvasStore((state) => state.filterText[panel.id] || '');
    const setFilterText = useCanvasStore((state) => state.setFilterText);

    const panelIndex = sidebarPanels.findIndex((p) => p.id === panel.id);

    const panelOptions = useMemo(
        () =>
            (Object.keys(panelTitles) as PanelType[]).map((key) => ({
                value: key,
                label: panelTitles[key],
                icon: panelIcons[key],
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

        panelOptions,
        currentPanelTitle: panel.type ? panelTitles[panel.type] : 'Пустая панель',
        currentPanelIcon: panel.type ? panelIcons[panel.type] : undefined,
        panelIndex,

        handleSelect,
        handleFilterChange,
    };
}
