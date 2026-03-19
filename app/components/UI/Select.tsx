'use client';

import { memo, useState, useRef } from 'react';
import { ChevronDown, Ban } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface SelectProps {
    value: string | null;
    options: string[];
    depth?: number;
    onChange: (value: string | null) => void;
}

export const Select = memo(function Select({ value, options, depth = 2, onChange }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selected = options.find((option) => option === value);

    return (
        <div ref={selectRef} className="flex flex-col w-full">
            <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                className={`
                    flex items-center gap-2 h-8 px-3 w-full text-sm cursor-pointer border border-depth-${depth + 1}
                    ${isOpen ? `rounded-t-md bg-depth-${depth + 1}` : `rounded-md bg-depth-${depth} hover:bg-depth-${depth + 1}`}
                `}
            >
                <ChevronDown
                    size={16}
                    className={`
                        transition-transform min-w-4 
                        ${isOpen && 'rotate-180'} 
                    `}
                />
                <span className="truncate">{selected ?? 'Не выбрано'}</span>
            </button>

            {isOpen && (
                <div
                    className={`flex flex-col gap-1 p-1 w-full rounded-b-md bg-depth-${depth} border border-depth-${depth + 1}`}
                >
                    {options.map((option) => {
                        const isSelected = option === value;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                }}
                                className={`
                                        w-full px-3 h-8 text-left text-sm truncate rounded-md cursor-pointer
                                        ${isSelected ? 'bg-bg-accent/10 text-text-accent' : `bg-depth-${depth + 1} hover:bg-depth-${depth + 2}`}
                                    `}
                            >
                                {option}
                            </button>
                        );
                    })}

                    {options.length === 0 && <EmptyState message="Нет доступных опций" />}

                    {selected !== undefined && <hr className={`border-b-0 border-depth-${depth + 2} my-0.5`} />}

                    {selected !== undefined && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange(null);
                            }}
                            className={`flex items-center justify-between w-full px-3 h-8 text-left text-sm text-red truncate rounded-md cursor-pointer bg-depth-${depth + 1} hover:bg-depth-${depth + 2}`}
                        >
                            Не выбрано
                            <Ban size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});
