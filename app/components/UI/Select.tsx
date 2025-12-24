'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
    value: string | null;
    options: string[];
    onChange: (value: string | null) => void;
    className?: string;
    placeholder?: string;
}

export const Select = memo(function Select({ value, options, onChange, className = '', placeholder = '-' }: SelectProps) {
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

    const selected = options.find((option) => option === value);

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
                <span className="truncate">{selected ?? '-'}</span>
                <ChevronDown size={14} />
            </button>

            {isOpen && (
                <div className="absolute flex flex-col gap-1 mt-1 w-full rounded-md border border-depth-3 bg-depth-1 shadow-lg p-1 z-10">
                    {options.map((option) => {
                        const isSelected = option === value;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm truncate rounded-md cursor-pointer
                                    ${isSelected ? 'bg-bg-accent text-white' : 'hover:bg-depth-2'}
                                `}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
