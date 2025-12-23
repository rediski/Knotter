'use client';

import { memo, useState, useRef, useEffect } from 'react';

import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
}

export const Select = memo(function Select({ value, options, onChange, className = '' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', onClickOutside);

        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const selected = options.find((option) => option.value === value);

    return (
        <div ref={selectRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`
                    flex items-center justify-between h-8 px-3 w-full rounded-md bg-depth-1 hover:bg-depth-2 cursor-pointer
                    ${className}
                `}
            >
                <span className="truncate">{selected?.label ?? '-'}</span>
                <ChevronDown size={14} />
            </button>

            {isOpen && (
                <div className="absolute flex flex-col gap-1 mt-1 w-full rounded-md border border-depth-3 bg-depth-1 shadow-lg p-1 z-10">
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm truncate rounded-md cursor-pointer
                                    ${isSelected ? 'bg-bg-accent text-white' : 'hover:bg-depth-2'}
                                `}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
