'use client';

import { useState, memo } from 'react';

interface EditableNameProps {
    name: string;
    onChange: (newName: string) => void;
    isSelected?: boolean;
    className?: string;
    maxWidth?: string;
    maxLength?: number;
}

export const EditableName = memo(function EditableName({
    name,
    onChange,
    isSelected = false,
    className = '',
    maxLength = 25,
}: EditableNameProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(name);

    const finishEditing = () => {
        setEditing(false);
        onChange(value.trim() || name);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            finishEditing();
        }

        if (e.key === 'Escape') {
            setEditing(false);
            setValue(name);
        }
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
            />
        );
    }

    if (!editing) {
        return (
            <span
                className={`
                    block text-sm cursor-pointer text-left overflow-hidden text-ellipsis whitespace-nowrap tabular-nums 
                    ${isSelected ? 'text-text-accent' : 'text-foreground'} 
                    ${className}
                `}
                style={{ minWidth: 0 }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                }}
            >
                {name}
            </span>
        );
    }
});
