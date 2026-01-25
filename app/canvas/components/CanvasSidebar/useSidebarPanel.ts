'use client';

import { useState, useRef, useCallback, useMemo } from 'react';

import type { SidebarPanel, PanelType } from './_sidebarPanel.types';

import { panelDefinitions } from './_panelDefinitions';
import { useSidebarPanels } from './useSideBarPanels';
import { useCanvasStore } from '@/canvas/store/canvasStore';

let activeMenuId: string | null = null;
const menuCallbacks: Map<string, () => void> = new Map();

export function useSidebarPanel(panel: SidebarPanel) {
    const panelRef = useRef<HTMLDivElement>(null);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isMenuOpenLocally, setIsMenuOpenLocally] = useState(false);

    const { setPanelType, sidebarPanels } = useSidebarPanels();

    const filterText = useCanvasStore((state) => state.filterText[panel.id] || '');
    const setFilterText = useCanvasStore((state) => state.setFilterText);

    const content = panel.type ? panelDefinitions[panel.type] : null;
    const PanelComponent = content?.component;

    const panelOptions = useMemo(
        () =>
            Object.entries(panelDefinitions).map(([key, value]) => ({
                value: key,
                label: value.label,
                icon: value.icon,
            })),
        [],
    );

    const currentPanelTitle = panel.type ? panelDefinitions[panel.type]?.label : 'Пустая панель';

    const currentPanelIcon = panel.type ? panelDefinitions[panel.type]?.icon : undefined;

    const panelIndex = sidebarPanels.findIndex((p) => p.id === panel.id);

    const closeMenu = useCallback(() => {
        setIsMenuOpenLocally(false);

        if (activeMenuId === panel.id) {
            activeMenuId = null;
            menuCallbacks.delete(panel.id);
        }
    }, [panel.id]);

    const openMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (activeMenuId && activeMenuId !== panel.id && menuCallbacks.has(activeMenuId)) {
                menuCallbacks.get(activeMenuId)!();
            }

            setMenuPosition({
                x: e.clientX,
                y: e.clientY,
            });

            setIsMenuOpenLocally(true);
            activeMenuId = panel.id;
            menuCallbacks.set(panel.id, closeMenu);
        },
        [panel.id, closeMenu],
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

        isMenuOpenLocally,
        menuPosition,
        filterText,

        PanelComponent,
        content,
        panelOptions,
        currentPanelTitle,
        currentPanelIcon,
        panelIndex,

        openMenu,
        closeMenu,
        handleSelect,
        handleFilterChange,
    };
}
