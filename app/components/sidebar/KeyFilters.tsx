'use client';

import { Checkbox } from '@/components/UI/Checkbox';
import { useState, useMemo, useEffect } from 'react';

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

interface KeyFiltersProps<T extends AnyObject = AnyObject> {
    data: T;
    onFilterChange: (filteredData: T) => void;
}

export function KeyFilters<T extends AnyObject = AnyObject>({ data, onFilterChange }: KeyFiltersProps<T>) {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const allKeys = useMemo(() => getAllKeys(data), [data]);

    useEffect(() => {
        if (allKeys.length > 0 && selectedKeys.size === 0) {
            setSelectedKeys(new Set(allKeys));
        }
    }, [allKeys]);

    const filteredData = useMemo((): T => {
        if (selectedKeys.size === 0 || selectedKeys.size === allKeys.length) {
            return data;
        }

        if (!Array.isArray(data)) return data;

        const filtered = data.map((item) => {
            if (!isObject(item)) return item;
            const filteredItem: Record<string, any> = {};

            for (const key of Object.keys(item)) {
                if (selectedKeys.has(key)) {
                    filteredItem[key] = (item as Record<string, any>)[key];
                }
            }

            return filteredItem;
        });

        return filtered as T;
    }, [data, selectedKeys, allKeys.length]);

    useEffect(() => {
        onFilterChange(filteredData);
    }, [filteredData]);

    return (
        <div className="flex flex-col gap-1 max-h-64 select-none">
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
    );
}
