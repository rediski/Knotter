import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SidebarPanel } from '@/_core/_/sidebarPanel';
import { v4 as uuid } from 'uuid';

export interface SidebarState {
    sidebarPanels: SidebarPanel[];
    setSidebarPanels: (panels: SidebarPanel[]) => void;
    addSidebarPanel: (type: SidebarPanel['type']) => void;
    removeSidebarPanel: (panelId: string) => void;

    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;

    filterText: Record<string, string>;
    setFilterText: (panelId: string, text: string) => void;
    clearFilterText: (panelId: string) => void;
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

            filterText: {},
            setFilterText: (panelId, text) =>
                set((state) => ({
                    filterText: {
                        ...state.filterText,
                        [panelId]: text,
                    },
                })),
            clearFilterText: (panelId) =>
                set((state) => {
                    const newFilterText = { ...state.filterText };
                    delete newFilterText[panelId];
                    return { filterText: newFilterText };
                }),
        }),
        {
            name: 'sidebar-storage',
            partialize: (state) => ({
                sidebarWidth: state.sidebarWidth,
                sidebarPanels: state.sidebarPanels,
                filterText: state.filterText,
            }),
        },
    ),
);
