'use client';

import type { SidebarPanel as SidebarPanelType } from '@/canvas/_core/_/sidebarPanel.types';

import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { Input } from '@/components/UI/Input';

import { PanelContextMenu } from '@/canvas/CanvasSidebar/PanelContextMenu';

import { Hierarchy } from '@/canvas/CanvasSidebar/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/CanvasSidebar/Inspector/Inspector';
import { Parameters } from '@/canvas/CanvasSidebar/Parameters/Parameters';

import { useSidebarPanel } from '@/canvas/CanvasSidebar/useSidebarPanel';
import { usePanelContextMenu } from '@/canvas/CanvasSidebar/usePanelContextMenu';

import { Search } from 'lucide-react';
import { EmptyState } from '@/components/UI/EmptyState';
import { Details } from '@/canvas/CanvasSidebar/Details/Details';
import { History } from '@/canvas/CanvasSidebar/History/History';

export function SidebarPanel({ panel }: { panel: SidebarPanelType }) {
    const {
        panelRef,
        filterText,
        panelOptions,
        currentPanelTitle,
        currentPanelIcon,
        panelIndex,
        handleSelect,
        handleFilterChange,
    } = useSidebarPanel(panel);

    const {
        menuRef,
        isMenuOpen,
        menuPosition,
        openMenu,
        closeMenu,
        canMoveUp,
        canMoveDown,
        handleAddPanel,
        handleRemove,
        handleMoveUp,
        handleMoveDown,
    } = usePanelContextMenu({ panel, panelRef });

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
                onAdd={handleAddPanel}
                onRemove={handleRemove}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
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
                            onChange={handleFilterChange}
                            placeholder="Фильтр..."
                            icon={Search}
                            iconSize={14}
                            className="bg-depth-2"
                        />
                    )}
                </div>

                <DropdownAbsolute title={currentPanelTitle} icon={currentPanelIcon}>
                    {panelOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
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

            <hr className="border-b-0 border-depth-3 mt-1" />

            {panel.type === 'details' ? (
                <Details />
            ) : panel.type === 'hierarchy' ? (
                <Hierarchy panelId={panel.id} />
            ) : panel.type === 'history' ? (
                <History />
            ) : panel.type === 'inspector' ? (
                <Inspector panelId={panel.id} />
            ) : panel.type === 'parameters' ? (
                <Parameters panelId={panel.id} />
            ) : (
                <EmptyState message="Выберите тип панели" />
            )}
        </div>
    );
}
