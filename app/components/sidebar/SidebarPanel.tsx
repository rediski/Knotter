'use client';

import type { SidebarPanel as SidebarPanelType } from '@/_core/_/sidebarPanel';

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

import { useSidebarPanel } from '@/components/sidebar/useSidebarPanel';
import { usePanelContextMenu } from '@/components/sidebar/usePanelContextMenu';

import { Search } from 'lucide-react';

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
                            className="bg-depth-2 border border-depth-3"
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
