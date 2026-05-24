import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DropdownState {
    openDropdownIds: (string | number)[];
    toggleDropdown: (id: string | number) => void;
    setDropdownOpen: (id: string | number, isOpen: boolean) => void;
    isDropdownOpen: (id: string | number) => boolean;
}

export const useDropdownStore = create<DropdownState>()(
    persist(
        (set, get) => ({
            openDropdownIds: [],

            toggleDropdown: (id) =>
                set((state) => ({
                    openDropdownIds: state.openDropdownIds.includes(id)
                        ? state.openDropdownIds.filter((dropdownId) => dropdownId !== id)
                        : [...state.openDropdownIds, id],
                })),

            setDropdownOpen: (id, isOpen) =>
                set((state) => ({
                    openDropdownIds: isOpen
                        ? [...state.openDropdownIds.filter((dropdownId) => dropdownId !== id), id]
                        : state.openDropdownIds.filter((dropdownId) => dropdownId !== id),
                })),

            isDropdownOpen: (id) => get().openDropdownIds.includes(id),
        }),
        {
            name: 'dropdown-storage',
        },
    ),
);
