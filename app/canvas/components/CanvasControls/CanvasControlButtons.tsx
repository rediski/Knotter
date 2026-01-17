'use client';

import { memo } from 'react';
import { Tooltip } from '@/components/UI/Tooltip';

interface ControlButton {
    active: boolean;
    onClick: () => void;
    Icon: React.ComponentType<{ size?: number }>;
    label: string;
    disabled?: boolean;
}

interface CanvasControlButtonsProps {
    controls: ControlButton[];
}

export const CanvasControlButtons = memo(function CanvasControlButtons({ controls }: CanvasControlButtonsProps) {
    return (
        <div className="flex gap-2">
            {controls.map(({ active, onClick, Icon, label, disabled }, index) => (
                <Tooltip key={index} label={label}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className={`
                            p-2 rounded-md w-fit shadow cursor-pointer disabled:bg-depth-2 disabled:text-gray disabled:cursor-not-allowed
                            ${active ? 'bg-bg-accent text-white' : 'bg-depth-2 hover:bg-border'}
                        `}
                        disabled={disabled}
                    >
                        <Icon size={16} />
                    </button>
                </Tooltip>
            ))}
        </div>
    );
});
