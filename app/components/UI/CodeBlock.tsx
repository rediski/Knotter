'use client';

import { ArrowDownToLine, Copy, Check, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

type Primitive = string | number | boolean | null | undefined;
type AnyObject = { [key: string]: any } | any[] | Primitive;

interface JsonProps {
    value: AnyObject;
}

interface CodeBlockProps<T = AnyObject> {
    data: T | null | undefined;
    showActions?: boolean;
    onToggleFilters?: () => void;
    showFilters?: boolean;
}

interface ActionButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    label?: string;
    isSuccess?: boolean;
    isActive?: boolean;
}

function isObject(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function Json({ value }: JsonProps) {
    const indentSize = 4;

    if (typeof value === 'string') return <span className="text-json-string">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-json-number">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-json-boolean">{String(value)}</span>;

    if (value === null) return <span className="text-json-null">null</span>;

    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-json-brackets">[]</span>;

        return (
            <>
                <span className="text-json-brackets">[</span>

                {value.map((item, i) => (
                    <div key={i} style={{ paddingLeft: indentSize + 'ch' }}>
                        <Json value={item} />

                        {i < value.length - 1 && <span>,</span>}
                    </div>
                ))}

                <span className="text-json-brackets">]</span>
            </>
        );
    }

    if (isObject(value)) {
        const entries = Object.entries(value);

        if (entries.length === 0) return <span className="text-json-brackets">{'{}'}</span>;

        return (
            <>
                <span className="text-json-brackets">{'{'}</span>

                {entries.map(([key, value], idx) => (
                    <div key={key} style={{ paddingLeft: indentSize + 'ch' }}>
                        <span className="text-json-key">"{key}"</span>: <Json value={value} />
                        {idx < entries.length - 1 && <span>,</span>}
                    </div>
                ))}

                <span className="text-json-brackets">{'}'}</span>
            </>
        );
    }

    return <span className="text-gray">unknown</span>;
}

const ActionButton = ({ onClick, icon: Icon, label = '', isSuccess = false, isActive = false }: ActionButtonProps) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-3 py-1.25 border rounded-md cursor-pointer select-none  
            ${isSuccess ? 'text-green' : 'text-contrast'}
            ${isActive ? 'bg-bg-accent border-bg-accent text-white' : 'bg-depth-3 hover:bg-depth-4/80 active:bg-depth-5 border-depth-4'}
        `}
    >
        <Icon size={16} /> {label}
    </button>
);

export function CodeBlock<T = AnyObject>({ data, showActions = true, onToggleFilters, showFilters }: CodeBlockProps<T>) {
    if (!data) return <span className="text-json-null">Нет данных</span>;

    const [isCopied, setIsCopied] = useState(false);

    const getItemData = () => {
        if (!data) return null;
        return JSON.stringify(data, null, 2);
    };

    const handleSave = () => {
        if (!data) return;

        const blob = new Blob([getItemData()!], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'selected-item.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        if (!data) return;

        try {
            await navigator.clipboard.writeText(getItemData()!);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка при копировании:', err);
        }
    };

    return (
        <div className="text-sm leading-5 select-text relative">
            {showActions && (
                <div className="sticky top-1 z-10 h-0 m-1">
                    <div className="absolute right-0 top-0 flex gap-2 translate-y-1 w-full">
                        <div className="flex ml-auto mr-1 gap-1 w-fit">
                            {onToggleFilters !== undefined && showFilters !== undefined && (
                                <ActionButton onClick={onToggleFilters} isActive={showFilters} icon={SlidersHorizontal} />
                            )}

                            <ActionButton
                                onClick={handleCopy}
                                icon={isCopied ? Check : Copy}
                                isSuccess={isCopied}
                                label="Копировать"
                            />

                            <ActionButton onClick={handleSave} icon={ArrowDownToLine} label="Сохранить" />
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 font-mono">
                <Json value={data} />
            </div>
        </div>
    );
}
