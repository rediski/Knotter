'use client';

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
};

export const Dropdown = memo(function Dropdown({
    title,
    children,
    disabled = false,
    isOpen = false,
    onToggle,
}: DropdownProps) {
    const toggle = () => {
        if (!disabled && onToggle) {
            onToggle();
        }
    };

    return (
        <div
            className={`
                flex flex-col gap-1 rounded-md bg-depth-2 w-full 
                ${disabled && 'opacity-50 cursor-not-allowed'}
            `}
        >
            <button
                onClick={toggle}
                disabled={disabled}
                className={`        
                    flex justify-start gap-2 items-center px-3 py-2 w-full text-sm 
                    ${disabled ? 'cursor-not-allowed text-gray' : 'cursor-pointer hover:bg-depth-3'} 
                    ${isOpen ? 'rounded-t-md' : 'rounded-md'}
                `}
            >
                <ChevronDown
                    className={`
                        transition-transform 
                        ${isOpen && !disabled && 'rotate-180'}
                    `}
                    size={16}
                />

                <span className="flex-1 text-left">{title}</span>
            </button>

            {isOpen && !disabled && <div className="flex flex-col gap-1 px-3 pb-2">{children}</div>}
        </div>
    );
});
