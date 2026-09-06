'use client';

import { useRef } from 'react';

import type { PanelType, SidebarPanel as SidebarPanelType } from '@/_core/_/sidebarPanel';

import { panelTitles, panelIcons } from '@/_core/_/sidebarPanel';

import { Clipboard } from '@/components/sidebar/Clipboard';
import { Hierarchy } from '@/components/sidebar/Hierarchy';
import { History } from '@/components/sidebar/History';
import { Inspector } from '@/components/sidebar/Inspector';
import { Parameters } from '@/components/sidebar/Parameters';

import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';
import { PanelContextMenu } from '@/components/sidebar/PanelContextMenu';

import { useSidebarStore } from '@/store/useSidebarStore';
import { useContextMenu } from '@/hooks/useContextMenu';

import { addPanel } from '@/utils/sidebar/addPanel';
import { removePanel } from '@/utils/sidebar/removePanel';
import { movePanelDown, movePanelUp } from '@/utils/sidebar/movePanel';
import { setPanelType } from '@/utils/sidebar/setPanelType';

export function SidebarPanel({ panel }: { panel: SidebarPanelType }) {
    const sidebarPanels = useSidebarStore((state) => state.sidebarPanels);
    const setSidebarPanels = useSidebarStore((state) => state.setSidebarPanels);
    const panelIndex = sidebarPanels.findIndex((sidebarPanel) => sidebarPanel.id === panel.id);

    const panelOptions = (Object.keys(panelTitles) as PanelType[]).map((key) => ({
        value: key,
        label: panelTitles[key],
        icon: panelIcons[key],
    }));

    const panelRef = useRef<HTMLDivElement>(null);

    const { isOpen, position, menuRef, handleContextMenu, closeMenu } = useContextMenu();

    const canMoveUp = panelIndex > 0;
    const canMoveDown = panelIndex < sidebarPanels.length - 1;

    const currentPanelTitle = panel.type ? panelTitles[panel.type] : 'Пустая панель';
    const currentPanelIcon = panel.type ? panelIcons[panel.type] : undefined;

    return (
        <div
            ref={panelRef}
            className="flex flex-col w-full h-full overflow-y-auto relative"
            onContextMenu={handleContextMenu}
            onClick={closeMenu}
        >
            <PanelContextMenu
                menuRef={menuRef}
                isOpen={isOpen}
                position={position}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                sidebarPanelsLength={sidebarPanels.length}
                onAdd={() => {
                    addPanel(sidebarPanels, setSidebarPanels);
                    closeMenu();
                }}
                onRemove={() => {
                    removePanel(sidebarPanels, setSidebarPanels, panel.id);
                    closeMenu();
                }}
                onMoveUp={() => {
                    movePanelUp(sidebarPanels, setSidebarPanels, canMoveUp, panelIndex);
                    closeMenu();
                }}
                onMoveDown={() => {
                    movePanelDown(sidebarPanels, setSidebarPanels, canMoveDown, panelIndex);
                    closeMenu();
                }}
            />

            <div
                className={`
                    flex justify-end items-center gap-1 p-1 pb-0
                    ${panelIndex > 0 && 'border-t border-depth-3'}
                `}
            >
                <DropdownAbsolute title={currentPanelTitle} icon={currentPanelIcon}>
                    {panelOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setPanelType(sidebarPanels, setSidebarPanels, panel.id, option.value);
                                closeMenu();
                            }}
                            className={`
                                flex items-center gap-2 px-3 h-8 text-left text-sm rounded-md cursor-pointer w-full 
                                ${
                                    option.label === currentPanelTitle
                                        ? 'bg-bg-accent text-text-accent'
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
                    case 'clipboard':
                        return <Clipboard />;
                    case 'hierarchy':
                        return <Hierarchy panelId={panel.id} />;
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
