import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SceneListState {
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export const useSceneListStore = create<SceneListState>()(
    persist(
        (set) => ({
            currentPage: 0,
            setCurrentPage: (page) => set({ currentPage: page }),
        }),
        {
            name: 'scene-list-storage',
            partialize: (state) => ({
                currentPage: state.currentPage,
            }),
        },
    ),
);
