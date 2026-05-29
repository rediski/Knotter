'use client';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { useItemsStore } from '@/store/useItemsStore';
import { EmptyState } from '@/components/UI/EmptyState';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/UI/Checkbox';

type AnyObject = { [key: string]: any } | any[] | string | number | boolean | null | undefined;

function isObject(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getAllKeys(obj: AnyObject): string[] {
    if (Array.isArray(obj)) {
        if (obj.length === 0) return [];
        const firstItem = obj[0];
        if (!isObject(firstItem)) return [];
        return Object.keys(firstItem);
    }

    if (isObject(obj)) {
        return Object.keys(obj);
    }

    return [];
}

export const Parameters = () => {
    const parameters = useItemsStore((state) => state.parameters);

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const allKeys = useMemo(() => getAllKeys(parameters), [parameters]);

    useMemo(() => {
        if (allKeys.length > 0 && selectedKeys.size === 0) {
            setSelectedKeys(new Set(allKeys));
        }
    }, [allKeys]);

    const getFilteredData = () => {
        if (selectedKeys.size === 0 || selectedKeys.size === allKeys.length) {
            return parameters;
        }

        const filtered: AnyObject[] = parameters.map((item) => {
            if (!isObject(item)) return item;
            const filteredItem: Record<string, any> = {};

            for (const key of Object.keys(item)) {
                if (selectedKeys.has(key)) {
                    filteredItem[key] = (item as Record<string, any>)[key];
                }
            }

            return filteredItem;
        });

        return filtered;
    };

    if (parameters.length === 0) {
        return <EmptyState message="У вас нет созданных параметров" />;
    }

    return (
        <div className="flex flex-col gap-1 overflow-y-auto m-1">
            <div className="flex flex-wrap gap-1 max-h-64 select-none">
                {allKeys.map((key) => (
                    <label
                        key={key}
                        className="flex items-center gap-2 text-md cursor-pointer bg-depth-2 hover:bg-depth-3 border border-depth-3 flex-1 min-w-64 px-3 py-1 rounded-md"
                    >
                        <Checkbox
                            checked={selectedKeys.has(key)}
                            onChange={(checked) => {
                                if (checked) {
                                    setSelectedKeys((prev) => new Set(prev).add(key));
                                    return;
                                }

                                setSelectedKeys((prev) => {
                                    if (prev.size === 1 && prev.has(key)) {
                                        return prev;
                                    }

                                    const newKeys = new Set(prev);
                                    newKeys.delete(key);

                                    return newKeys;
                                });
                            }}
                        />

                        <span className="truncate text-sm" title={key}>
                            {key}
                        </span>
                    </label>
                ))}
            </div>

            <div className="relative bg-depth-2 border border-depth-3 rounded-md">
                <CodeBlock data={getFilteredData()} />
            </div>
        </div>
    );
};
