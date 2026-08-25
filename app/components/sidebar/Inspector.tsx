'use client';

import { memo, useState, useEffect, useRef } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { InspectorScene } from '@/components/sidebar/InspectorScene';
import { InspectorNode } from '@/components/sidebar/InspectorNode';
import { InspectorEdge } from '@/components/sidebar/InspectorEdge';
import { InspectorParameter } from '@/components/sidebar/InspectorParameter';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getSelectedItem } from '@/utils/items/getSelectedItems';
import { getSelectedParameter } from '@/utils/parameters/getSelectedParameter';

const FIELD_TITLES = {
    NAME: 'Наименование',
    DESCRIPTION: 'Описание',
    POSITION: 'Позиция',
    SHAPE: 'Форма',
    COLOR: 'Цвет',
    EDGE_FROM: 'Входящие связи',
    EDGE_TO: 'Исходящие связи',
    EDGE_FROM_NODE: 'Начальный узел',
    EDGE_TO_NODE: 'Конечный узел',
    TYPE: 'Тип',
    DEFAULT_VALUE: 'Значение по умолчанию',
} as const;

export const Inspector = memo(function Inspector({ panelId }: { panelId?: string }) {
    const [mounted, setMounted] = useState(false);
    const prevSelectedItemIds = useRef<string[]>([]);
    const prevSelectedParameters = useRef<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { currentSceneId, scenes, selectedItemIds, selectedParameters, setSelectedParameters, setSelectedItemIds } =
        useItemsStore();
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    useEffect(() => {
        const prevItems = prevSelectedItemIds.current;
        const prevParams = prevSelectedParameters.current;

        const itemsChanged =
            selectedItemIds.length !== prevItems.length || selectedItemIds.some((id, i) => id !== prevItems[i]);
        const paramsChanged =
            selectedParameters.length !== prevParams.length || selectedParameters.some((id, i) => id !== prevParams[i]);

        if (itemsChanged && selectedItemIds.length > 0 && selectedParameters.length > 0) {
            setSelectedParameters([]);
        }

        if (paramsChanged && selectedParameters.length > 0 && selectedItemIds.length > 0) {
            setSelectedItemIds([]);
        }

        prevSelectedItemIds.current = selectedItemIds;
        prevSelectedParameters.current = selectedParameters;
    }, [selectedItemIds, selectedParameters, setSelectedParameters, setSelectedItemIds]);

    const isSceneSelected =
        mounted && selectedItemIds.length === 1 && currentSceneId && selectedItemIds[0] === currentSceneId;
    const selectedScene = isSceneSelected && currentSceneId ? scenes[currentSceneId] : null;

    const selectedItem = mounted && !isSceneSelected && selectedItemIds.length === 1 ? getSelectedItem() : null;
    const selectedParameter = mounted && !selectedItem && selectedParameters.length === 1 ? getSelectedParameter() : null;

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const shouldShowField = (fieldTitle: string) => {
        if (!filterText) return true;
        return fieldTitle.toLowerCase().includes(filterText.toLowerCase());
    };

    const showName = shouldShowField(FIELD_TITLES.NAME);
    const showDescription = shouldShowField(FIELD_TITLES.DESCRIPTION);
    const showPosition = shouldShowField(FIELD_TITLES.POSITION);
    const showShape = shouldShowField(FIELD_TITLES.SHAPE);
    const showColor = shouldShowField(FIELD_TITLES.COLOR);
    const showEdgeFrom = shouldShowField(FIELD_TITLES.EDGE_FROM);
    const showEdgeTo = shouldShowField(FIELD_TITLES.EDGE_TO);
    const showEdgeFromNode = shouldShowField(FIELD_TITLES.EDGE_FROM_NODE);
    const showEdgeToNode = shouldShowField(FIELD_TITLES.EDGE_TO_NODE);
    const showType = shouldShowField(FIELD_TITLES.TYPE);
    const showDefaultValue = shouldShowField(FIELD_TITLES.DEFAULT_VALUE);

    const hasVisibleFields =
        showName ||
        showDescription ||
        showPosition ||
        showShape ||
        showColor ||
        showEdgeFrom ||
        showEdgeTo ||
        showEdgeFromNode ||
        showEdgeToNode ||
        showType ||
        showDefaultValue;

    if (!mounted) {
        return <EmptyState message="Загрузка..." />;
    }

    if (filterText && !hasVisibleFields) {
        return <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />;
    }

    if (isSceneSelected && selectedScene) {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3 h-full">
                <InspectorScene
                    scene={selectedScene}
                    showName={showName}
                    showDescription={showDescription}
                    showColor={showColor}
                />
            </div>
        );
    }

    if (selectedItem) {
        if (selectedItem.kind === 'node') {
            return (
                <div className="overflow-y-auto mt-1 border-t border-depth-3 h-full">
                    <InspectorNode
                        node={selectedItem}
                        items={items}
                        showName={showName}
                        showDescription={showDescription}
                        showPosition={showPosition}
                        showShape={showShape}
                        showColor={showColor}
                        showEdgeFrom={showEdgeFrom}
                        showEdgeTo={showEdgeTo}
                    />
                </div>
            );
        }

        if (selectedItem.kind === 'edge') {
            return (
                <div className="overflow-y-auto mt-1 border-t border-depth-3 h-full">
                    <InspectorEdge
                        edge={selectedItem}
                        items={items}
                        showName={showName}
                        showColor={showColor}
                        showEdgeFromNode={showEdgeFromNode}
                        showEdgeToNode={showEdgeToNode}
                    />
                </div>
            );
        }
    }

    if (selectedParameter) {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3 h-full">
                <InspectorParameter
                    parameter={selectedParameter}
                    showName={showName}
                    showDescription={showDescription}
                    showType={showType}
                    showDefaultValue={showDefaultValue}
                />
            </div>
        );
    }

    return <EmptyState message="Необходимо выбрать один элемент или параметр" />;
});
