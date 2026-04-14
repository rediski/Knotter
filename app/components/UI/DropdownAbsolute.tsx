'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { ChevronDown, LucideProps } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    depth?: number;
    icon?: React.ComponentType<LucideProps>;
    align?: 'left' | 'right';
};

export const DropdownAbsolute = memo(function DropdownAbsolute({
    title,
    children,
    depth = 2,
    icon: Icon,
    align = 'right',
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [close]);

    const handleContentClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            close();
        },
        [close],
    );

    return (
        <div ref={dropdownRef} className="relative w-fit">
            <button
                onClick={toggle}
                className={`flex justify-between items-center gap-1 px-3 py-1 h-8 w-full border text-sm rounded-md truncate cursor-pointer
                    bg-depth-${depth} hover:bg-depth-${depth + 1} border-depth-${depth < 3 ? 3 : depth + 1} `}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} />}

                    {title}
                </div>

                <ChevronDown
                    className={`
                        transition-transform 
                        ${isOpen && 'rotate-180'}
                    `}
                    size={16}
                />
            </button>

            {isOpen && (
                <div
                    className={`
                        absolute top-full flex flex-col gap-1 w-50 text-sm shadow rounded-md mt-1 p-1 z-50 border
                        bg-depth-${depth} border-depth-${depth < 3 ? 3 : depth + 1} 
                        ${align === 'right' ? 'right-0' : 'left-0'}
                    `}
                    onClick={handleContentClick}
                >
                    {children}
                </div>
            )}
        </div>
    );
});
