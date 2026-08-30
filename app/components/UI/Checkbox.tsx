'use client';

import { memo, useCallback, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export const Checkbox = memo(function Checkbox({
    checked = false,
    onChange,
    className = 'bg-depth-4',
    ...props
}: CheckboxProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked);
        },
        [onChange],
    );

    return (
        <label className="relative flex items-center w-fit cursor-pointer h-8">
            <input type="checkbox" checked={checked} onChange={handleChange} className="sr-only peer" {...props} />

            <div
                className={`
                    w-5 h-5 rounded-sm peer-focus:ring-2 peer-focus:ring-bg-accent peer-checked:bg-bg-accent peer-checked:border-border-accent flex items-center justify-center
                    ${className}
                `}
            >
                {checked && <Check size={16} className="text-white" />}
            </div>
        </label>
    );
});
