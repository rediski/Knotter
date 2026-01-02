'use client';
import { MouseEvent, KeyboardEvent, memo } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { CanvasItem } from '@/canvas/canvas.types';
import { EditableName } from '@/components/UI/EditableName';
import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { GripVertical } from 'lucide-react';

interface HierarchyItemProps {
    canvasItem: CanvasItem;
    isSelected: boolean;
    onSelect: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange?: (updatedItem: CanvasItem) => void;
    onMouseDown?: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export const HierarchyItem = memo(function HierarchyItem({
    canvasItem,
    isSelected,
    onSelect,
    onChange,
    onKeyDown,
}: HierarchyItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: canvasItem.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = getDynamicIcon(canvasItem.kind);

    return (
        <li ref={setNodeRef} style={style}>
            <button
                className={`w-full px-3 h-9 rounded-md outline-none tabular-nums cursor-pointer 
                    ${
                        isSelected
                            ? 'bg-bg-accent/10 focus-visible:bg-bg-accent/15'
                            : 'bg-depth-2 hover:bg-depth-3 focus-visible:bg-border'
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(e);
                }}
                onKeyDown={onKeyDown}
            >
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 w-full">
                        <div className={`max-w-4 w-full ${isSelected ? 'text-text-accent' : 'text-foreground'} `}>
                            <Icon size={16} />
                        </div>

                        <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                        <EditableName
                            name={canvasItem.name}
                            isSelected={isSelected}
                            onChange={(newName) => onChange?.({ ...canvasItem, name: newName })}
                        />
                    </div>

                    <span {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="text-gray" size={16} />
                    </span>
                </div>
            </button>
        </li>
    );
});
