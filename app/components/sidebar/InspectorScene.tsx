'use client';

import { memo, useCallback } from 'react';

import type { Scene } from '@/_core/_/canvas.types';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { ColorPicker } from '@/components/sidebar/ColorPicker';
import { Dropdown } from '@/components/UI/Dropdown';

import { useDropdownStore } from '@/store/useDropdownStore';
import { useCanvasStore } from '@/store/useCanvasStore';

import { changeSceneName } from '@/utils/scene/changeSceneName';
import { changeSceneDescription } from '@/utils/scene/changeSceneDescription';
import { changeSceneColor } from '@/utils/scene/changeSceneColor';
import { toggleMagnetMode } from '@/utils/canvas/toggleMagnetMode';
import { toggleTooltipMode } from '@/utils/canvas/toggleTooltipMode';
import { toggleInvertY } from '@/utils/canvas/toggleInvertY';

import { LandPlot, Magnet, Grid2x2, Move3d, Eye, EyeOff, EyeClosed, MoveVertical, Settings2 } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Наименование',
    DESCRIPTION: 'Описание',
    COLOR: 'Цвет вкладки',
    POSITION: 'Позиция',
    CANVAS_SETTINGS: 'Настройки сцены',
    MAGNET: 'Магнит (M)',
    GRID: 'Сетка (G)',
    AXES: 'Оси (A)',
    INVERT_Y: 'Инвертировать Y (Y)',
    TOOLTIP: 'Подсказки (T)',
} as const;

interface InspectorSceneProps {
    scene: Scene;
    showName: boolean;
    showDescription: boolean;
    showColor: boolean;
}

export const InspectorScene = memo(function InspectorScene({
    scene,
    showName,
    showDescription,
    showColor,
}: InspectorSceneProps) {
    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    const isMagnet = useCanvasStore((state) => state.isMagnet);
    const showGrid = useCanvasStore((state) => state.showGrid);
    const showAxes = useCanvasStore((state) => state.showAxes);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);
    const invertY = useCanvasStore((state) => state.invertY);
    const toggleShowGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleShowAxes = useCanvasStore((state) => state.toggleShowAxes);

    const handleNameChange = useCallback(
        (newName: string) => {
            changeSceneName(scene.id, newName);
        },
        [scene.id],
    );

    const handleDescriptionChange = useCallback(
        (newDescription: string) => {
            changeSceneDescription(scene.id, newDescription);
        },
        [scene.id],
    );

    const handleColorChange = useCallback(
        (newColor: string | null) => {
            changeSceneColor(scene.id, newColor);
        },
        [scene.id],
    );

    const getTooltipIcon = () => {
        switch (tooltipMode) {
            case 'always':
                return Eye;
            case 'hover':
                return EyeClosed;
            case 'never':
                return EyeOff;
        }
    };

    const getTooltipLabel = () => {
        switch (tooltipMode) {
            case 'always':
                return 'Всегда';
            case 'hover':
                return 'При наведении';
            case 'never':
                return 'Никогда';
        }
    };

    const controls = [
        {
            active: tooltipMode !== 'never',
            onClick: toggleTooltipMode,
            Icon: getTooltipIcon(),
            label: `${FIELD_TITLES.TOOLTIP}: ${getTooltipLabel()}`,
            key: 'tooltip',
        },
        {
            active: isMagnet,
            onClick: toggleMagnetMode,
            Icon: Magnet,
            label: FIELD_TITLES.MAGNET,
            key: 'magnet',
        },
        {
            active: invertY,
            onClick: toggleInvertY,
            Icon: MoveVertical,
            label: FIELD_TITLES.INVERT_Y,
            key: 'invertY',
        },
        {
            active: showGrid,
            onClick: toggleShowGrid,
            Icon: Grid2x2,
            label: FIELD_TITLES.GRID,
            key: 'grid',
        },
        {
            active: showAxes,
            onClick: toggleShowAxes,
            Icon: Move3d,
            label: FIELD_TITLES.AXES,
            key: 'axes',
        },
    ];

    return (
        <div className="flex flex-col px-1 gap-1">
            {showName && (
                <div className="flex flex-col gap-1 pt-1">
                    <Input
                        value={scene.name}
                        onChange={handleNameChange}
                        placeholder={FIELD_TITLES.NAME}
                        icon={LandPlot}
                        className="bg-depth-2 border border-depth-3"
                    />
                </div>
            )}

            {showDescription && scene.description !== undefined && (
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={scene.description || ''}
                        onChange={handleDescriptionChange}
                        placeholder={FIELD_TITLES.DESCRIPTION}
                        className="border border-depth-3"
                        rows={3}
                    />
                </div>
            )}

            <Dropdown title={FIELD_TITLES.CANVAS_SETTINGS} isOpen={isDropdownOpen(8)} onToggle={() => toggleDropdown(8)}>
                <div className="flex flex-col gap-1">
                    {controls.map(({ active, onClick, Icon, label, key }) => (
                        <label
                            key={key}
                            className={`flex items-center gap-2 cursor-pointer border rounded-md h-9 px-3 ${active ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-3 border-depth-4'}`}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick();
                                }}
                            >
                                <Icon size={16} />
                            </button>

                            <hr className={`h-6 border-l ${active ? 'border-bg-accent/10' : 'border-depth-5'}`} />

                            <span className="text-sm select-none truncate">{label}</span>
                        </label>
                    ))}
                </div>
            </Dropdown>

            <span className="text-xs text-gray text-right p-1 select-text">{scene.id}</span>
        </div>
    );
});
