'use client';

import { useRef } from 'react';

import type { PanelType, SidebarPanel as SidebarPanelType } from '@/_core/_/sidebarPanel';

import { panelTitles, panelIcons } from '@/_core/_/sidebarPanel';

import { Clipboard } from '@/components/sidebar/Clipboard';
import { Details } from '@/components/sidebar/Details';
import { Hierarchy } from '@/components/sidebar/Hierarchy';
import { Inspector } from '@/components/sidebar/Inspector';

import { History } from '@/components/sidebar/History';

import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';
import { PanelContextMenu } from '@/components/sidebar/PanelContextMenu';
import { Parameters } from '@/components/sidebar/Parameters';

import { usePanelContextMenu } from '@/components/sidebar/usePanelContextMenu';

import { useSidebarStore } from '@/store/useSidebarStore';

import { addPanel } from '@/utils/sidebar/addPanel';
import { removePanel } from '@/utils/sidebar/removePanel';
import { movePanelDown, movePanelUp } from '@/utils/sidebar/movePanel';
import { setPanelType } from '@/utils/sidebar/setPanelType';

import { Search } from 'lucide-react';

export function SidebarPanel({ panel }: { panel: SidebarPanelType }) {
    const sidebarPanels = useSidebarStore((state) => state.sidebarPanels);
    const setSidebarPanels = useSidebarStore((state) => state.setSidebarPanels);
    const panelIndex = sidebarPanels.findIndex((sidebarPanel) => sidebarPanel.id === panel.id);

    const panelOptions = (Object.keys(panelTitles) as PanelType[]).map((key) => ({
        value: key,
        label: panelTitles[key],
        icon: panelIcons[key],
    }));

    const filterText = useSidebarStore((state) => state.filterText[panel.id] || '');
    const setFilterText = useSidebarStore((state) => state.setFilterText);

    const panelRef = useRef<HTMLDivElement>(null);

    const { menuRef, isMenuOpen, menuPosition, openMenu, closeMenu } = usePanelContextMenu({
        panel,
        panelRef,
    });

    const canMoveUp = panelIndex > 0;
    const canMoveDown = panelIndex < sidebarPanels.length - 1;

    const currentPanelTitle = panel.type ? panelTitles[panel.type] : 'Пустая панель';
    const currentPanelIcon = panel.type ? panelIcons[panel.type] : undefined;

    return (
        <div
            ref={panelRef}
            className="flex flex-col w-full h-full overflow-y-auto relative"
            onContextMenu={openMenu}
            onClick={closeMenu}
        >
            <PanelContextMenu
                menuRef={menuRef}
                isOpen={isMenuOpen}
                position={menuPosition}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                onAdd={() => {
                    addPanel(sidebarPanels, setSidebarPanels);
                    closeMenu();
                }}
                onRemove={() => {
                    removePanel(sidebarPanels, setSidebarPanels, panel.id);
                    closeMenu();
                }}
                onMoveUp={() => movePanelUp(sidebarPanels, setSidebarPanels, canMoveUp, panelIndex)}
                onMoveDown={() => movePanelDown(sidebarPanels, setSidebarPanels, canMoveDown, panelIndex)}
            />

            <div
                className={`
                    flex justify-between items-center gap-1 p-1 pb-0
                    ${panelIndex > 0 && 'border-t border-depth-3'}
                `}
            >
                <div className="flex-1">
                    {panel.type && (
                        <Input
                            value={filterText}
                            onChange={() => setFilterText(panel.id, filterText)}
                            placeholder="Фильтр..."
                            icon={Search}
                            iconSize={14}
                            className="bg-depth-2 border border-depth-3"
                        />
                    )}
                </div>

                <DropdownAbsolute title={currentPanelTitle} icon={currentPanelIcon}>
                    {panelOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPanelType(sidebarPanels, setSidebarPanels, panel.id, option.value)}
                            className={`
                                flex items-center gap-2 px-3 h-8 text-left text-sm rounded-md cursor-pointer w-full 
                                ${
                                    option.label === currentPanelTitle
                                        ? 'bg-bg-accent/15 text-text-accent'
                                        : 'bg-depth-3 hover:bg-depth-4'
                                }
                            `}
                        >
                            {option.icon && <option.icon size={16} />}
                            {option.label}
                        </button>
                    ))}
                </DropdownAbsolute>
            </div>

            {(() => {
                switch (panel.type) {
                    case 'details':
                        return <Details />;
                    case 'hierarchy':
                        return <Hierarchy panelId={panel.id} />;
                    case 'clipboard':
                        return <Clipboard />;
                    case 'history':
                        return <History />;
                    case 'inspector':
                        return <Inspector panelId={panel.id} />;
                    case 'parameters':
                        return <Parameters />;
                    default:
                        return <EmptyState message="Выберите тип панели" />;
                }
            })()}
        </div>
    );
}
