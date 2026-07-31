'use client';

import { memo, useState, useEffect } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { InspectorScene } from '@/components/sidebar/InspectorScene';
import { InspectorNode } from '@/components/sidebar/InspectorNode';
import { InspectorEdge } from '@/components/sidebar/InspectorEdge';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getSelectedItem } from '@/utils/items/getSelectedItems';

const FIELD_TITLES = {
    NAME: 'Название',
    DESCRIPTION: 'Описание',
    POSITION: 'Позиция',
    SHAPE: 'Форма',
    COLOR: 'Цвет',
    EDGE_FROM: 'Входящие связи',
    EDGE_TO: 'Исходящие связи',
    EDGE_FROM_NODE: 'Начальный узел',
    EDGE_TO_NODE: 'Конечный узел',
} as const;

export const Inspector = memo(function Inspector({ panelId }: { panelId?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const isSceneSelected =
        mounted && selectedItemIds.length === 1 && currentSceneId && selectedItemIds[0] === currentSceneId;
    const selectedScene = isSceneSelected && currentSceneId ? scenes[currentSceneId] : null;

    const selectedItem = mounted && !isSceneSelected ? getSelectedItem() : null;

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

    const hasVisibleFields =
        showName ||
        showDescription ||
        showPosition ||
        showShape ||
        showColor ||
        showEdgeFrom ||
        showEdgeTo ||
        showEdgeFromNode ||
        showEdgeToNode;

    if (!mounted) {
        return <EmptyState message="Загрузка..." />;
    }

    if (filterText && !hasVisibleFields) {
        return <EmptyState message={`Не найдено полей по запросу "${filterText}"`} />;
    }

    if (isSceneSelected && selectedScene) {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3">
                <InspectorScene
                    scene={selectedScene}
                    showName={showName}
                    showDescription={showDescription}
                    showColor={showColor}
                />
            </div>
        );
    }

    if (!selectedItem) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    if (selectedItem.kind === 'node') {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3">
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
            <div className="overflow-y-auto mt-1 border-t border-depth-3">
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

    return null;
});
