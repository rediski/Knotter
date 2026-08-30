'use client';

import { ArrowDownToLine, Copy, Check, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from '@/components/UI/CodeBlock';

type AnyObject = { [key: string]: any } | any[] | Primitive;
type Primitive = string | number | boolean | null | undefined;

interface DataCodeBlockProps<T = AnyObject> {
    data: T | null | undefined;
    maxHeight?: string;
    title?: string;
    fileName?: string;
}

interface ActionButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    label?: string;
    isSuccess?: boolean;
    isActive?: boolean;
}

const ActionButton = ({ onClick, icon: Icon, label = '', isSuccess = false, isActive = false }: ActionButtonProps) => (
    <button
        onClick={onClick}
        className={`
            flex items-center w-8 h-8 p-2 rounded-md cursor-pointer border
            ${isSuccess ? 'text-green' : 'text-contrast'}
            ${isActive ? 'bg-bg-accent border-border-accent text-white' : 'bg-depth-3 hover:bg-depth-4/80 active:bg-depth-5 border-depth-4'}
        `}
    >
        <Icon size={16} /> {label}
    </button>
);

export function DataCodeBlock<T = AnyObject>({
    data,
    maxHeight,
    title = 'Все сцены',
    fileName = 'data',
}: DataCodeBlockProps<T>) {
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
        link.download = `${fileName}.json`;
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
        <div className="text-sm relative">
            <div className="text-sm relative">
                <div className="flex items-center bg-depth-2 border-b border-depth-3 justify-between gap-1 p-1 pl-3 w-full h-10.5">
                    <span>{title}</span>

                    <div className="flex gap-1">
                        <ActionButton onClick={handleCopy} icon={isCopied ? Check : Copy} isSuccess={isCopied} />

                        <ActionButton onClick={handleSave} icon={ArrowDownToLine} />
                    </div>
                </div>

                <CodeBlock data={data} maxHeight={maxHeight} />
            </div>
        </div>
    );
}
