'use client';

import { memo, useState, useRef } from 'react';
import { ChevronDown, Ban } from 'lucide-react';

interface SelectProps {
    value: string | null;
    options: string[];
    onChange: (value: string | null) => void;
    label?: string;
}

export const Select = memo(function Select({ value, options, onChange, label }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selected = options.find((option) => option === value);

    console.log(selected);
    return (
        <div ref={selectRef} className="flex flex-col w-full">
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`
                    flex items-center gap-2 h-8 px-3 w-full cursor-pointer
                    ${isOpen ? 'rounded-t-md bg-depth-3' : 'rounded-md bg-depth-2 hover:bg-depth-3'}
                `}
            >
                <ChevronDown size={14} className={`${isOpen && 'rotate-180'} transition-transform`} />
                <span className="truncate">{selected ?? label}</span>
            </button>

            {isOpen && (
                <div className="w-full rounded-b-md bg-depth-2">
                    {label && (
                        <div className="m-1 p-1 text-gray border-b border-depth-4 text-xs tracking-wide text-muted-foreground select-none">
                            {label}
                        </div>
                    )}

                    <div className="flex flex-col gap-1 p-1">
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
                                        ${isSelected ? 'bg-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4'}
                                    `}
                                >
                                    {option}
                                </button>
                            );
                        })}

                        {selected !== undefined && <hr className="border-b-0 border-depth-4 my-0.5" />}

                        {selected !== undefined && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                }}
                                className="flex items-center justify-between w-full px-3 h-8 text-left text-sm text-red truncate rounded-md cursor-pointer bg-depth-3 hover:bg-depth-4"
                            >
                                Не выбрано
                                <Ban size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
