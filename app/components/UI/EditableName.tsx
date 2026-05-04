'use client';

import { useState, memo } from 'react';

interface EditableNameProps {
    name: string;
    onChange: (newName: string) => void;
    isSelected?: boolean;
    className?: string;
    maxWidth?: string;
    maxLength?: number;
    disabled?: boolean;
}

export const EditableName = memo(function EditableName({
    name,
    onChange,
    isSelected = false,
    className = '',
    maxLength = 25,
    disabled = false,
}: EditableNameProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(name);

    const finishEditing = () => {
        if (disabled) return;
        setEditing(false);
        onChange(value.trim() || name);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === 'Enter') {
            finishEditing();
        }

        if (e.key === 'Escape') {
            setEditing(false);
            setValue(name);
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (disabled) return;
        e.stopPropagation();
        setEditing(true);
    };

    if (editing) {
        return (
            <input
                type="text"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={finishEditing}
                onKeyDown={handleInputKeyDown}
                className="bg-depth-1 border border-bg-accent rounded px-1 text-foreground text-sm outline-none w-full tabular-nums"
                onDoubleClick={(e) => e.stopPropagation()}
                maxLength={maxLength}
                disabled={disabled}
            />
        );
    }

    if (!editing) {
        return (
            <span
                className={`
                    block text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap tabular-nums 
                    ${isSelected ? 'text-text-accent' : 'text-foreground'} 
                    ${disabled && 'opacity-50 cursor-not-allowed'} 
                    ${className}
                `}
                style={{ minWidth: 0 }}
                onDoubleClick={handleDoubleClick}
            >
                {name}
            </span>
        );
    }
});
