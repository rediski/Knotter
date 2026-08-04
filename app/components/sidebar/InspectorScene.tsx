'use client';

import { memo, useCallback } from 'react';

import type { Scene } from '@/_core/_/canvas.types';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { ColorPicker } from '@/components/sidebar/ColorPicker';
import { Dropdown } from '@/components/UI/Dropdown';

import { useDropdownStore } from '@/store/useDropdownStore';

import { changeSceneName } from '@/utils/scene/changeSceneName';
import { changeSceneDescription } from '@/utils/scene/changeSceneDescription';
import { changeSceneColor } from '@/utils/scene/changeSceneColor';

import { LandPlot } from 'lucide-react';

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    COLOR: 'Цвет вкладки',
    POSITION: 'Позиция',
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

            {showColor && (
                <Dropdown title={FIELD_TITLES.COLOR} isOpen={isDropdownOpen(7)} onToggle={() => toggleDropdown(7)}>
                    <ColorPicker color={scene.color ?? null} onColorChange={handleColorChange} />
                </Dropdown>
            )}
        </div>
    );
});
