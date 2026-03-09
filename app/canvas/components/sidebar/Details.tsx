import { useState } from 'react';
import { EmptyState } from '@/components/UI/EmptyState';
import { CodeBlock } from '@/components/UI/CodeBlock';

import { getSelectedItem } from '@/canvas/utils/items/getSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { ArrowDownToLine, Copy, Check, type LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    isSuccess?: boolean;
}

const ActionButton = ({ onClick, icon: Icon, isSuccess = false }: ActionButtonProps) => (
    <button
        onClick={onClick}
        className={`
                p-2 rounded shadow bg-depth-3 hover:bg-depth-4 active:bg-depth-5 cursor-pointer  
                ${isSuccess ? 'text-green' : 'text-contrast'}
            `}
    >
        <Icon size={16} />
    </button>
);

export const Details = () => {
    const [isCopied, setIsCopied] = useState(false);
    const items = useItemsStore((state) => state.items);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const selectedItem = getSelectedItem({ items, selectedItemIds });

    const getItemData = () => {
        if (!selectedItem) return null;
        return JSON.stringify(selectedItem, null, 2);
    };

    const handleSave = () => {
        if (!selectedItem) return;

        const blob = new Blob([getItemData()!], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'selected-item.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        if (!selectedItem) return;

        try {
            await navigator.clipboard.writeText(getItemData()!);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка при копировании:', err);
        }
    };

    if (selectedItem === null) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    return (
        <div className="relative m-1 p-4 bg-depth-2 rounded-md space-y-3 overflow-y-auto">
            <div className="absolute right-2 top-2 flex gap-2">
                <ActionButton onClick={handleCopy} icon={isCopied ? Check : Copy} isSuccess={isCopied} />

                <ActionButton onClick={handleSave} icon={ArrowDownToLine} />
            </div>

            <CodeBlock data={selectedItem} />
        </div>
    );
};
