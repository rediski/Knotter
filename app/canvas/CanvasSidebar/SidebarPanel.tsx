'use client';

import type { SidebarPanel } from '@/canvas/_core/_/sidebarPanel.types';

import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { Input } from '@/components/UI/Input';
import { PanelContextMenu } from '@/canvas/CanvasSidebar/PanelContextMenu';
import { useSidebarPanel } from '@/canvas/CanvasSidebar/useSidebarPanel';

import { Search } from 'lucide-react';

export function SidebarPanel({ panel }: { panel: SidebarPanel }) {
    const {
        panelRef,
        isMenuOpenLocally,
        menuPosition,
        filterText,

        PanelComponent,
        content,
        panelOptions,
        currentPanelTitle,
        currentPanelIcon,
        panelIndex,

        openMenu,
        closeMenu,
        handleSelect,
        handleFilterChange,
    } = useSidebarPanel(panel);

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
                    flex justify-between items-center gap-1 p-1 pb-0
                    ${panelIndex > 0 && 'border-t border-depth-3'}
                `}
            >
                <div className="flex-1">
                    {PanelComponent && (
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
                            onClick={() => handleSelect(option.value as any)}
                            className="flex items-center gap-2 px-3 h-8 bg-depth-3 hover:bg-depth-4 text-left text-sm rounded-md cursor-pointer w-full"
                        >
                            {option.icon && <option.icon size={16} />}
                            {option.label}
                        </button>
                    ))}
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
