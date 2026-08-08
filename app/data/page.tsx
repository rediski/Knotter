'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Scene, Node, Edge, CanvasItem } from '@/_core/_/canvas.types';
import type { Parameter } from '@/_core/_/parameter';

import { useState, useMemo, useEffect, useCallback } from 'react';

import { useItemsStore } from '@/store/useItemsStore';
import { DataViewMode, useSidebarStore } from '@/store/useSidebarStore';

import { DataCodeBlock } from '@/components/data/DataCodeBlock';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Checkbox } from '@/components/UI/Checkbox';
import { Input } from '@/components/UI/Input';

import { Home, LandPlot, X } from 'lucide-react';

type FilterableData = Parameter | Scene | Node | Edge | (Record<string, unknown> & { kind?: string });
type FilteredItem = Record<string, unknown>;

const VIEW_LABELS: Record<DataViewMode, string> = {
    scenes: 'Сцены',
    parameters: 'Параметры',
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
    scenes: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        color: 'Цвет',
        items: 'Элементы',
        history: 'История',
        historyPosition: 'Позиция в истории',
        createdAt: 'Создано',
        updatedAt: 'Обновлено',
        kind: 'Тип',
    },
    parameters: {
        id: 'ID',
        name: 'Наименование',
        type: 'Тип',
        defaultValue: 'Базовое значение',
        parentId: 'ID Родителя',
    },
};

const ITEM_FIELD_LABELS: Record<string, string> = {
    kind: 'Тип',
    id: 'ID',
    sceneId: 'ID Сцены',
    name: 'Наименование',
    description: 'Описание',
    shapeType: 'Тип фигуры',
    color: 'Цвет',
    position: 'Позиция',
    parameters: 'Параметры',
    from: 'Начальный узел',
    to: 'Конечный узел',
};

const SCENE_FIELDS: (keyof Scene)[] = [
    'kind',
    'id',
    'name',
    'description',
    'color',
    'items',
    'history',
    'historyPosition',
    'createdAt',
    'updatedAt',
];

const NODE_FIELDS: (keyof Node)[] = [
    'kind',
    'id',
    'sceneId',
    'name',
    'description',
    'shapeType',
    'color',
    'position',
    'parameters',
];

const EDGE_FIELDS: (keyof Edge)[] = ['kind', 'id', 'name', 'from', 'to', 'color'];

const PARAMETER_FIELDS: (keyof Parameter)[] = ['id', 'name', 'type', 'defaultValue', 'parentId'];

const getFieldLabel = (mode: DataViewMode, field: string): string => {
    const labels = FIELD_LABELS[mode === 'scenes' ? 'scenes' : 'parameters'];
    return labels?.[field] || field;
};

const getItemFieldLabel = (field: string): string => {
    return ITEM_FIELD_LABELS[field] || field;
};

export default function DataPage() {
    const router = useRouter();

    const parameters = useItemsStore((state) => state.parameters);
    const scenes = useItemsStore((state) => state.scenes);

    const { dataViewMode, setDataViewMode } = useSidebarStore();

    const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
    const [selectedItemFields, setSelectedItemFields] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');

    const availableFields = useMemo((): readonly string[] => {
        if (dataViewMode === 'parameters') {
            return PARAMETER_FIELDS;
        }

        return SCENE_FIELDS;
    }, [dataViewMode]);

    const availableItemFields = useMemo((): readonly string[] => {
        if (dataViewMode !== 'scenes') return [];

        return [...new Set([...NODE_FIELDS, ...EDGE_FIELDS])];
    }, [dataViewMode]);

    useEffect(() => {
        if (availableFields.length > 0 && selectedFields.size === 0) {
            setSelectedFields(new Set(availableFields));
        }
    }, [availableFields]);

    useEffect(() => {
        if (availableItemFields.length > 0 && selectedItemFields.size === 0) {
            setSelectedItemFields(new Set(availableItemFields));
        }
    }, [availableItemFields]);

    const filterByName = useCallback(
        <T extends FilterableData>(data: T[]): T[] => {
            if (!searchQuery.trim()) return data;

            const query = searchQuery.toLowerCase().trim();

            if (dataViewMode === 'parameters') {
                return data.filter((item) => {
                    return 'name' in item && typeof item.name === 'string' && item.name.toLowerCase().includes(query);
                });
            }

            const result: T[] = [];

            for (const item of data) {
                const scene = item as Scene & Record<string, unknown>;
                const sceneNameMatches =
                    'name' in scene && typeof scene.name === 'string' && scene.name.toLowerCase().includes(query);

                if (sceneNameMatches) {
                    result.push(item);
                    continue;
                }

                if ('items' in scene && Array.isArray(scene.items)) {
                    const matchingItems = (scene.items as CanvasItem[]).filter((canvasItem) => {
                        return (
                            'name' in canvasItem &&
                            typeof canvasItem.name === 'string' &&
                            canvasItem.name.toLowerCase().includes(query)
                        );
                    });

                    if (matchingItems.length > 0) {
                        for (const matchingItem of matchingItems) {
                            result.push(matchingItem as unknown as T);
                        }
                    }
                }
            }

            return result;
        },
        [searchQuery, dataViewMode],
    );

    const filteredData = useMemo((): FilteredItem[] => {
        if (dataViewMode === 'parameters') {
            if (selectedFields.size === 0) return [];

            const result: FilteredItem[] = [];

            for (const item of parameters) {
                const filtered: FilteredItem = {};

                for (const field of selectedFields) {
                    if (field in item) {
                        filtered[field] = item[field as keyof Parameter];
                    }
                }

                result.push(filtered);
            }

            return filterByName(result);
        }

        const scenesArray = Object.values(scenes);

        if (selectedFields.size === 0) return [];

        const filteredItems = filterByName(scenesArray);

        if (filteredItems.length > 0) {
            const firstItem = filteredItems[0];
            if (firstItem && 'kind' in firstItem && firstItem.kind !== 'scene') {
                return filteredItems.map((item) => {
                    const filtered: FilteredItem = {};

                    for (const field of selectedItemFields) {
                        if (field in item && item[field as keyof typeof item] !== undefined) {
                            filtered[field] = item[field as keyof typeof item];
                        }
                    }

                    return filtered;
                });
            }
        }

        return filteredItems.map((scene) => {
            const filtered: FilteredItem = {};

            for (const field of selectedFields) {
                if (!(field in scene) || field === 'items') continue;

                filtered[field] = scene[field as keyof typeof scene];
            }

            const items = 'items' in scene && Array.isArray(scene.items) ? scene.items : [];

            if (!selectedFields.has('items')) {
                filtered['items'] = [];
                return filtered;
            }

            if (selectedItemFields.size === 0) {
                filtered['items'] = [];
                return filtered;
            }

            const filteredItems = [];

            for (const item of items) {
                const filteredItem: FilteredItem = {};

                for (const itemField of selectedItemFields) {
                    if (item && itemField in item && item[itemField as keyof typeof item] !== undefined) {
                        filteredItem[itemField] = item[itemField as keyof typeof item];
                    }
                }

                filteredItems.push(filteredItem);
            }

            filtered['items'] = filteredItems;

            return filtered;
        });
    }, [dataViewMode, parameters, scenes, selectedFields, selectedItemFields, filterByName]);

    useEffect(() => {
        document.title = 'Данные';
    }, []);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.push('/');
    };

    const createToggleHandler = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
        return (fieldName: string) => {
            setter((prev) => {
                const updatedSelection = new Set(prev);

                if (updatedSelection.has(fieldName)) {
                    updatedSelection.delete(fieldName);
                    return updatedSelection;
                }

                updatedSelection.add(fieldName);
                return updatedSelection;
            });
        };
    };

    const toggleField = createToggleHandler(setSelectedFields);
    const toggleItemField = createToggleHandler(setSelectedItemFields);

    const createToggleAllHandler = (
        setter: React.Dispatch<React.SetStateAction<Set<string>>>,
        availableFields: readonly string[],
    ) => {
        return () => {
            setter((previousSelection) => {
                const isAllSelected = previousSelection.size === availableFields.length;
                return isAllSelected ? new Set() : new Set(availableFields);
            });
        };
    };

    const toggleAllFields = createToggleAllHandler(setSelectedFields, availableFields);
    const toggleAllItemFields = createToggleAllHandler(setSelectedItemFields, availableItemFields);

    const isAllSelected = selectedFields.size === availableFields.length && availableFields.length > 0;
    const isAllItemSelected = selectedItemFields.size === availableItemFields.length && availableItemFields.length > 0;

    const activeIndex = Object.keys(VIEW_LABELS).indexOf(dataViewMode);

    const sceneFields = availableFields.filter((field) => field !== 'items');
    const hasItemsField = new Set(availableFields).has('items');
    const isItemsSelected = selectedFields.has('items');

    return (
        <div className="flex flex-col gap-1 p-1 h-full">
            <div className="flex gap-1 h-10.5 m-1">
                <div className="flex items-center gap-1 bg-depth-1 p-1 rounded-md border border-depth-3">
                    <Link
                        href="/"
                        className="flex items-center w-8 h-8 p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 cursor-pointer"
                    >
                        <Home size={16} />
                    </Link>

                    <ThemeToggle />

                    <button
                        onClick={handleGoBack}
                        className="flex items-center w-8 h-8 p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 cursor-pointer"
                        aria-label="Назад"
                    >
                        <LandPlot size={16} />
                    </button>
                </div>
            </div>

            <div className="flex gap-1 container m-auto">
                {availableFields.length > 0 && (
                    <div className="w-xs h-fit bg-depth-1 border border-depth-3 rounded-md select-none">
                        <div className="relative flex items-center gap-1 p-1 bg-background border-b border-depth-3 h-10.5">
                            <div
                                className="absolute h-[calc(100%-8px)] top-1 rounded-md bg-depth-2 transition-[left,width] duration-300 ease-in-out"
                                style={{
                                    left: activeIndex === 0 ? '4px' : `calc(50% + 2px)`,
                                    width: `calc(50% - 6px)`,
                                }}
                            />

                            {Object.entries(VIEW_LABELS).map(([mode, label]) => (
                                <button
                                    key={mode}
                                    onClick={() => setDataViewMode(mode as DataViewMode)}
                                    className={`
                                        relative z-10 flex-1 px-4 h-8 rounded-md text-sm text-foreground cursor-pointer
                                        ${dataViewMode === mode ? '' : 'hover:bg-depth-1'}
                                    `}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="relative p-1 border-b border-depth-3">
                            <Input
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Поиск..."
                                className="bg-depth-2 border border-depth-3"
                            />

                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray hover:text-foreground cursor-pointer z-10"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto max-h-[calc(100vh-4px-4px-42px-42px-42px-4px-4px-4px-4px)]">
                            {dataViewMode === 'scenes' && (
                                <>
                                    <div className="flex flex-col gap-1 p-1">
                                        <div className="flex items-center gap-3 px-3 py-1">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <Checkbox checked={isAllSelected} onChange={toggleAllFields} />
                                                <span className="text-sm font-bold">Поля сцен</span>
                                            </label>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {sceneFields.map((field) => (
                                                <label
                                                    key={field}
                                                    className="flex items-center gap-3 px-3 py-1 rounded-md bg-depth-2 border border-depth-3 hover:bg-depth-2 cursor-pointer"
                                                >
                                                    <Checkbox
                                                        checked={selectedFields.has(field)}
                                                        onChange={() => toggleField(field)}
                                                    />
                                                    <span className="text-sm truncate">
                                                        {getFieldLabel(dataViewMode, field)}
                                                    </span>
                                                </label>
                                            ))}

                                            {hasItemsField && (
                                                <label className="flex items-center gap-3 px-3 py-1 rounded-md bg-depth-2 border border-depth-3 hover:bg-depth-2 cursor-pointer">
                                                    <Checkbox
                                                        checked={selectedFields.has('items')}
                                                        onChange={() => toggleField('items')}
                                                    />

                                                    <span className="text-sm truncate">
                                                        {getFieldLabel(dataViewMode, 'items')}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {isItemsSelected && hasItemsField && availableItemFields.length > 0 && (
                                        <div className="flex flex-col gap-1 p-1 border-t border-depth-3">
                                            <div className="flex items-center gap-3 px-3 py-1">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <Checkbox checked={isAllItemSelected} onChange={toggleAllItemFields} />
                                                    <span className="text-sm font-bold">Поля элементов</span>
                                                </label>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                {availableItemFields.map((itemField) => (
                                                    <label
                                                        key={itemField}
                                                        className="flex items-center gap-3 px-3 py-1 rounded-md bg-depth-2 border border-depth-3 hover:bg-depth-2 cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            checked={selectedItemFields.has(itemField)}
                                                            onChange={() => toggleItemField(itemField)}
                                                        />

                                                        <span className="text-sm truncate">
                                                            {getItemFieldLabel(itemField)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {dataViewMode === 'parameters' && (
                                <div className="flex flex-col gap-1 p-1">
                                    <div className="flex items-center gap-3 px-3 py-1">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <Checkbox checked={isAllSelected} onChange={toggleAllFields} />
                                            <span className="text-sm font-bold">Поля параметров</span>
                                        </label>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        {availableFields.map((field) => (
                                            <label
                                                key={field}
                                                className="flex items-center gap-3 px-3 py-1 rounded-md bg-depth-2 border border-depth-3 hover:bg-depth-2 cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={selectedFields.has(field)}
                                                    onChange={() => toggleField(field)}
                                                />

                                                <span className="text-sm truncate">
                                                    {getFieldLabel(dataViewMode, field)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="relative max-h-[calc(100vh-4px-4px-42px-4px-4px-4px)] bg-depth-1 border border-depth-3 rounded-md w-full">
                    <DataCodeBlock
                        data={filteredData}
                        maxHeight="calc(100vh - 108px)"
                        title={searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все сцены'}
                        fileName="selected-item"
                    />
                </div>
            </div>
        </div>
    );
}
