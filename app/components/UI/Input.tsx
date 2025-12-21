'use client';

import { memo, useCallback, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

const MAX_INPUT_LENGTH = 36;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
    icon?: LucideIcon;
    iconSize?: number;
    className?: string;
    type?: 'text' | 'number';
}

export const Input = memo(function Input({
    value,
    onChange,
    icon: Icon,
    iconSize = 16,
    className = 'bg-depth-2',
    type = 'text',
    ...props
}: InputProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            if (type === 'number') {
                if (newValue === '' || newValue === '-' || /^-?\d*\.?\d*$/.test(newValue)) {
                    if (MAX_INPUT_LENGTH) {
                        newValue = newValue.slice(0, MAX_INPUT_LENGTH);
                    }

                    onChange(newValue);
                }
            } else {
                if (MAX_INPUT_LENGTH && newValue.length > MAX_INPUT_LENGTH) {
                    newValue = newValue.slice(0, MAX_INPUT_LENGTH);
                }
                onChange(newValue);
            }
        },
        [onChange, type],
    );

    const hasIcon = Boolean(Icon);

    return (
        <div className="relative flex w-full">
            <input
                type={type}
                value={value}
                onChange={handleChange}
                className={`
                    w-full text-foreground placeholder-gray px-3 py-1 text-sm rounded-md focus:outline-none h-8 
                    ${hasIcon && 'pr-8'} 
                    ${className}
                `}
                {...props}
            />

            {Icon && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray">
                    <Icon size={iconSize} />
                </div>
            )}
        </div>
    );
});
