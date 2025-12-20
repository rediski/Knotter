'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from './Input';

interface OptionPickerOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
}

interface OptionPickerProps {
    options: OptionPickerOption[];
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const OptionPicker = memo(function OptionPicker({
    options,
    onSelect,
    placeholder = 'Выберите...',
}: OptionPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    const pickerRef = useRef<HTMLDivElement>(null);
    const pickerContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dropdown = pickerContentRef.current;

        if (!dropdown) return;

        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation();
        };

        dropdown.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            dropdown.removeEventListener('wheel', handleWheel);
        };
    }, [isOpen]);

    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div
            ref={pickerRef}
            className="relative flex flex-col justify-start items-center gap-1 bg-depth-1 w-full text-sm rounded-md cursor-pointer "
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-8 w-full px-3 py-2 cursor-pointer"
            >
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />

                <span>{placeholder}</span>
            </button>

            {isOpen && (
                <div ref={pickerContentRef} className="flex flex-col gap-1 w-full max-h-64 overflow-auto px-3 pb-2">
                    <Input
                        value={query}
                        onChange={(value) => setQuery(value)}
                        icon={Search}
                        iconSize={14}
                        placeholder="Поиск..."
                        className="bg-depth-2 border border-depth-3"
                    />

                    <div className="flex flex-col gap-1">
                        {filteredOptions.map((option) => {
                            const Icon = option.icon;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="flex items-center gap-2 px-3 h-8 bg-depth-2 hover:bg-depth-3 border border-depth-3 text-left text-sm rounded-md cursor-pointer"
                                >
                                    {Icon && <Icon size={16} />}

                                    {option.label}
                                </button>
                            );
                        })}

                        {filteredOptions.length === 0 && (
                            <div className="text-gray text-center text-sm py-2">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
