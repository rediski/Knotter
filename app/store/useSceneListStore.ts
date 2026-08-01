import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SceneListState {
    scrollPosition: number;
    setScrollPosition: (position: number) => void;
}

export const useSceneListStore = create<SceneListState>()(
    persist(
        (set) => ({
            scrollPosition: 0,
            setScrollPosition: (position) => set({ scrollPosition: position }),
        }),
        {
            name: 'scene-list-storage',
            partialize: (state) => ({
                scrollPosition: state.scrollPosition,
            }),
        },
    ),
);
