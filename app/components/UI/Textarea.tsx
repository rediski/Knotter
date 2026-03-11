'use client';

import { memo, useCallback } from 'react';
import { TextareaHTMLAttributes } from 'react';

const MAX_TEXTAREA_LENGTH = 512;

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
}

export const Textarea = memo(function Textarea({ value, onChange, className = '', ...props }: TextareaProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            let newValue = e.target.value;

            if (MAX_TEXTAREA_LENGTH && newValue.length > MAX_TEXTAREA_LENGTH) {
                newValue = newValue.slice(0, MAX_TEXTAREA_LENGTH);
            }

            onChange(newValue);
        },
        [onChange],
    );

    return (
        <div className="flex flex-col gap-1 w-full">
            <textarea
                value={value}
                onChange={handleChange}
                className={`
                    flex items-center w-full bg-depth-2 focus:outline-none focus:ring-2 focus:ring-bg-accent/70 text-foreground placeholder-gray px-3 py-2 text-sm rounded-md  resize-none field-sizing-content min-h-[3lh] max-h-[12lh] 
                    ${className}
                `}
                {...props}
            />
        </div>
    );
});
