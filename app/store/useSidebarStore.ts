import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SidebarPanel } from '@/_core/_/sidebarPanel';
import { v4 as uuid } from 'uuid';

export type DataViewMode = 'scenes' | 'parameters';

export interface SidebarState {
    sidebarPanels: SidebarPanel[];
    setSidebarPanels: (panels: SidebarPanel[]) => void;
    addSidebarPanel: (type: SidebarPanel['type']) => void;
    removeSidebarPanel: (panelId: string) => void;

    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;

    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    toggleShowFilters: () => void;

    dataViewMode: DataViewMode;
    setDataViewMode: (mode: DataViewMode) => void;
    toggleDataViewMode: () => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            sidebarPanels: [
                { id: uuid(), type: 'hierarchy' },
                { id: uuid(), type: 'inspector' },
            ],
            setSidebarPanels: (sidebarPanels) => set({ sidebarPanels }),
            addSidebarPanel: (type) =>
                set((state) => ({
                    sidebarPanels: [...state.sidebarPanels, { id: uuid(), type }],
                })),
            removeSidebarPanel: (panelId) =>
                set((state) => ({
                    sidebarPanels: state.sidebarPanels.filter((p) => p.id !== panelId),
                })),

            sidebarWidth: 380,
            setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

            showFilters: true,
            setShowFilters: (showFilters) => set({ showFilters }),
            toggleShowFilters: () => set((state) => ({ showFilters: !state.showFilters })),

            dataViewMode: 'parameters',
            setDataViewMode: (dataViewMode) => set({ dataViewMode }),
            toggleDataViewMode: () =>
                set((state) => ({
                    dataViewMode: state.dataViewMode === 'parameters' ? 'scenes' : 'parameters',
                })),
        }),
        {
            name: 'sidebar-storage',
            partialize: (state) => ({
                sidebarWidth: state.sidebarWidth,
                sidebarPanels: state.sidebarPanels,
                showFilters: state.showFilters,
                dataViewMode: state.dataViewMode,
            }),
        },
    ),
);
