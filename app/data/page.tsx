'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useMemo, useEffect } from 'react';

import { useItemsStore } from '@/store/useItemsStore';
import { DataViewMode, useSidebarStore } from '@/store/useSidebarStore';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Checkbox } from '@/components/UI/Checkbox';

import { Home, LandPlot } from 'lucide-react';

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
    from: 'От',
    to: 'К',
};

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

    const availableFields = useMemo(() => {
        if (dataViewMode === 'parameters') {
            if (parameters.length === 0) return [];
            return Object.keys(parameters[0] || {});
        }

        const scenesArray = Object.values(scenes);

        if (scenesArray.length === 0) return [];
        return Object.keys(scenesArray[0] || {});
    }, [dataViewMode, parameters, scenes]);

    const availableItemFields = useMemo(() => {
        if (dataViewMode !== 'scenes') return [];

        const scenesArray = Object.values(scenes);
        if (scenesArray.length === 0) return [];

        const firstScene = scenesArray[0];
        if (!firstScene.items || firstScene.items.length === 0) return [];

        const firstItem = firstScene.items[0];
        if (!firstItem || typeof firstItem !== 'object') return [];

        return Object.keys(firstItem);
    }, [dataViewMode, scenes]);

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

    const filteredData = useMemo(() => {
        if (dataViewMode === 'parameters') {
            if (selectedFields.size === 0) return [];

            return parameters.map((item) => {
                const filtered: Record<string, any> = {};

                for (const field of selectedFields) {
                    if (item && typeof item === 'object' && field in item) {
                        filtered[field] = (item as Record<string, any>)[field];
                    }
                }

                return filtered;
            });
        }

        const scenesArray = Object.values(scenes);

        if (selectedFields.size === 0) return [];

        return scenesArray.map((scene) => {
            const filtered: Record<string, any> = {};

            for (const field of selectedFields) {
                if (!(scene && typeof scene === 'object' && field in scene)) continue;

                if (field === 'items') {
                    continue;
                }

                filtered[field] = (scene as Record<string, any>)[field];
            }

            const items = scene.items || [];

            if (!selectedFields.has('items')) {
                filtered['items'] = [];
                return filtered;
            }

            if (selectedItemFields.size === 0) {
                filtered['items'] = [];
                return filtered;
            }

            filtered['items'] = items.map((item: any) => {
                const filteredItem: Record<string, any> = {};

                for (const itemField of selectedItemFields) {
                    if (item && typeof item === 'object' && itemField in item) {
                        filteredItem[itemField] = item[itemField];
                    }
                }

                return filteredItem;
            });

            return filtered;
        });
    }, [dataViewMode, parameters, scenes, selectedFields, selectedItemFields]);

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
        availableFields: string[],
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
    const hasItemsField = availableFields.includes('items');
    const isItemsSelected = selectedFields.has('items');

    return (
        <div className="flex flex-col gap-1 p-1 h-full">
            <div className="flex gap-1 h-10.5">
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

            <div className="flex gap-1">
                {availableFields.length > 0 && (
                    <div className="w-xs h-fit sticky top-1 bg-depth-1 border border-depth-3 rounded-md overflow-y-auto max-h-(calc(100vh-300px)) select-none">
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

                        {dataViewMode === 'scenes' && (
                            <>
                                <div className="flex flex-col gap-1 p-2">
                                    <div className="flex items-center gap-3 px-3 py-1">
                                        <Checkbox checked={isAllSelected} onChange={toggleAllFields} />
                                        <span className="text-sm font-bold">Поля сцен</span>
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
                                    <div className="flex flex-col gap-1 p-2 border-t border-depth-3">
                                        <div className="flex items-center gap-3 px-3 py-1">
                                            <Checkbox checked={isAllItemSelected} onChange={toggleAllItemFields} />
                                            <span className="text-sm font-bold">Поля элементов</span>
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

                                                    <span className="text-sm truncate">{getItemFieldLabel(itemField)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {dataViewMode === 'parameters' && (
                            <div className="flex flex-col gap-1 p-2">
                                <div className="flex items-center gap-3 px-3 py-1">
                                    <Checkbox checked={isAllSelected} onChange={toggleAllFields} />
                                    <span className="text-sm font-bold">Поля параметров</span>
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

                                            <span className="text-sm truncate">{getFieldLabel(dataViewMode, field)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative bg-depth-1 border border-depth-3 rounded-md w-full">
                    <CodeBlock data={filteredData} showActions={true} />
                </div>
            </div>
        </div>
    );
}
