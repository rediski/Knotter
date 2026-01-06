'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { ChevronDown, LucideProps } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    light?: boolean;
    icon?: React.ComponentType<LucideProps>;
};

export const DropdownAbsolute = memo(function DropdownAbsolute({
    title,
    children,
    light = false,
    icon: Icon,
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
                className={`
                    flex justify-between items-center gap-1 px-3 py-1 h-8 w-full text-sm rounded-md cursor-pointer 
                    ${light ? 'bg-depth-3 hover:bg-depth-4' : 'bg-depth-2 hover:bg-border'}
                `}
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
                        absolute top-full right-0 flex flex-col gap-1 w-[200px] text-sm shadow-md rounded-md mt-1 p-1 z-50
                        ${light ? 'bg-border' : 'bg-depth-2'}
                    `}
                    onClick={handleContentClick}
                >
                    {children}
                </div>
            )}
        </div>
    );
});
