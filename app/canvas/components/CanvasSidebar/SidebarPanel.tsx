'use client';

import { useState, useRef, useCallback } from 'react';

import type { SidebarPanel, PanelType } from '@/canvas/components/CanvasSidebar/_sidebarPanel.types';

import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { Input } from '@/components/UI/Input';

import { panelDefinitions } from '@/canvas/components/CanvasSidebar/_panelDefinitions';
import { PanelContextMenu } from '@/canvas/components/CanvasSidebar/PanelContextMenu';

import { useSidebarPanels } from '@/canvas/hooks/useSideBarPanels';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { Search } from 'lucide-react';

let activeMenuId: string | null = null;
const menuCallbacks: Map<string, () => void> = new Map();

export function SidebarPanel({ panel }: { panel: SidebarPanel }) {
    const panelRef = useRef<HTMLDivElement>(null);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isMenuOpenLocally, setIsMenuOpenLocally] = useState(false);

    const filterText = useCanvasStore((state) => state.filterText[panel.id] || '');
    const setFilterText = useCanvasStore((state) => state.setFilterText);

    const content = panel.type ? panelDefinitions[panel.type] : null;

    const panelOptions = Object.entries(panelDefinitions).map(([key, value]) => ({
        value: key,
        label: value.label,
        icon: value.icon,
    }));

    const currentPanelTitle = panel.type ? panelDefinitions[panel.type]?.label : 'Пустая панель';
    const currentPanelIcon = panel.type ? panelDefinitions[panel.type]?.icon : undefined;

    const { setPanelType, sidebarPanels } = useSidebarPanels();

    const handleSelect = (value: PanelType) => {
        setPanelType(panel.id, value);
        setFilterText(panel.id, '');
    };

    const openMenu = (e: React.MouseEvent) => {
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
    };

    const closeMenu = useCallback(() => {
        setIsMenuOpenLocally(false);

        if (activeMenuId === panel.id) {
            activeMenuId = null;
            menuCallbacks.delete(panel.id);
        }
    }, [panel.id]);

    const handleFilterChange = (value: string) => {
        setFilterText(panel.id, value);
    };

    const PanelComponent = content?.component;

    const panelIndex = sidebarPanels.findIndex((p) => p.id === panel.id);

    return (
        <div
            ref={panelRef}
            className="flex flex-col h-full"
            onContextMenu={openMenu}
            onClick={closeMenu}
            style={{ position: 'relative', width: '100%', height: '100%' }}
        >
            <PanelContextMenu
                panel={panel}
                panelRef={panelRef}
                closeMenu={closeMenu}
                isMenuOpenLocally={isMenuOpenLocally}
                position={menuPosition}
            />

            <div
                className={`
                    flex justify-between items-center gap-1 p-1 
                    ${panelIndex > 0 && 'border-t border-depth-3'}
                `}
            >
                <div className="flex-1">
                    <Input
                        value={filterText}
                        onChange={handleFilterChange}
                        placeholder="Фильтр..."
                        icon={Search}
                        iconSize={14}
                        className="bg-depth-2"
                    />
                </div>

                <DropdownAbsolute title={currentPanelTitle} icon={currentPanelIcon}>
                    {panelOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value as PanelType)}
                            className="flex items-center gap-2 px-3 h-8 bg-depth-3 hover:bg-depth-4 text-left text-sm rounded-md cursor-pointer w-full"
                        >
                            {option.icon && <option.icon size={16} />}
                            {option.label}
                        </button>
                    ))}

                    {panelOptions.length === 0 && (
                        <div className="text-gray text-center text-sm py-2">Нет доступных опций</div>
                    )}
                </DropdownAbsolute>
            </div>

            {content && PanelComponent ? (
                <PanelComponent panelId={panel.id} />
            ) : (
                <div className="h-full flex items-center justify-center text-gray text-sm">Выберите тип панели</div>
            )}
        </div>
    );
}
