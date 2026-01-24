'use client';

import { memo, useCallback, InputHTMLAttributes, useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

const MAX_INPUT_LENGTH = 36;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
    icon?: LucideIcon;
    iconSize?: number;
    className?: string;
    type?: 'text' | 'number';
    allowNegative?: boolean;
    allowDecimal?: boolean;
    decimalPlaces?: number;
    name?: string;
}

export const Input = memo(function Input({
    value,
    onChange,
    icon: Icon,
    iconSize = 16,
    className = 'bg-depth-2',
    type = 'text',
    allowNegative = true,
    allowDecimal = true,
    decimalPlaces = 4,
    name = 'untitled',
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        if (!isFocused) {
            setLocalValue(value);
        }
    }, [value, isFocused]);

    const validateAndFormat = useCallback(
        (input: string): string => {
            if (type !== 'number') return input;
            if (input === '') return '';
            if (input === '-') return allowNegative ? '-' : '';

            const notNumbersOrSymbolsRegex = /[^0-9.\-]/g;
            const leadingZerosRegex = /^(-?)0+(?=\d)/;

            let result = input.replace(notNumbersOrSymbolsRegex, '');

            if (allowNegative) {
                const minusCount = (result.match(/-/g) || []).length;

                if (minusCount > 1) result = '-' + result.replace(/-/g, '');
                if (minusCount === 1 && !result.startsWith('-')) result = result.replace(/-/g, '');
            }

            if (!allowNegative) {
                result = result.replace(/-/g, '');
            }

            if (allowDecimal) {
                const parts = result.split('.');

                if (parts.length > 2) result = parts[0] + '.' + parts.slice(1).join('');

                if (parts.length > 1 && decimalPlaces) {
                    parts[1] = parts[1].slice(0, decimalPlaces);
                    result = parts.join('.');
                }
            }

            if (!allowDecimal) {
                result = result.replace(/\./g, '');
            }

            if (result !== '' && result !== '-') {
                const hasDecimalPoint = result.includes('.');

                if (hasDecimalPoint) {
                    const [integer, decimal] = result.split('.');
                    const cleanInteger = integer.replace(leadingZerosRegex, '$1');
                    result = cleanInteger + '.' + decimal;
                }

                if (!hasDecimalPoint) {
                    result = result.replace(leadingZerosRegex, '$1');
                }
            }

            if (MAX_INPUT_LENGTH && result.length > MAX_INPUT_LENGTH) {
                result = result.slice(0, MAX_INPUT_LENGTH);
            }

            return result;
        },
        [type, allowNegative, allowDecimal, decimalPlaces],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            const formattedValue = validateAndFormat(newValue);

            setLocalValue(formattedValue);
            onChange(formattedValue);
        },
        [onChange, validateAndFormat],
    );

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setTimeout(() => {
            e.target.select();
        }, 0);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);

        if (localValue === '-') {
            const normalized = '0';

            setLocalValue(normalized);
            onChange(normalized);
        }

        if (localValue === '') {
            const normalized = '';

            setLocalValue(normalized);
            onChange(normalized);
        }

        if (localValue.endsWith('.')) {
            const normalized = localValue.slice(0, -1) || '';

            setLocalValue(normalized);
            onChange(normalized);
        }
    }, [localValue, onChange]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (type === 'number') {
                const allowedKeys = [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '.',
                    '-',
                    'Backspace',
                    'Delete',
                    'Enter',
                    'Escape',
                    'Tab',
                ];

                const isModifier = e.ctrlKey || e.metaKey || e.altKey;

                if (!isModifier && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                    return;
                }

                if (e.key === '.') {
                    if (!allowDecimal || localValue.includes('.')) {
                        e.preventDefault();
                    }
                }

                if (e.key === '-') {
                    if (
                        !allowNegative ||
                        (e.currentTarget.selectionStart !== 0 && e.currentTarget.selectionStart !== null)
                    ) {
                        e.preventDefault();
                    }
                }
            }
        },
        [type, allowDecimal, allowNegative, localValue],
    );

    const hasIcon = Boolean(Icon);
    const isNumberType = type === 'number';

    return (
        <div className="relative flex w-full">
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                inputMode={isNumberType ? 'decimal' : 'text'}
                className={`
                    w-full text-foreground placeholder-gray px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-bg-accent/70 h-8
                    ${hasIcon && 'pr-8'}
                    ${className}
                `}
                name={name}
                {...props}
            />

            {Icon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray">
                    <Icon size={iconSize} />
                </div>
            )}
        </div>
    );
});
