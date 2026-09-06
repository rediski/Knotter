'use client';

import { memo, useState, useEffect, useRef } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { InspectorScene } from '@/components/sidebar/InspectorScene';
import { InspectorNode } from '@/components/sidebar/InspectorNode';
import { InspectorEdge } from '@/components/sidebar/InspectorEdge';
import { InspectorParameter } from '@/components/sidebar/InspectorParameter';

import { useItemsStore } from '@/store/useItemsStore';

import { getSelectedItem } from '@/utils/items/getSelectedItems';
import { getSelectedParameter } from '@/utils/parameters/getSelectedParameters';

export const Inspector = memo(function Inspector() {
    const [mounted, setMounted] = useState(false);
    const prevSelectedItemIds = useRef<string[]>([]);
    const prevSelectedParameterIds = useRef<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds, selectedParameterIds, setSelectedParameterIds } =
        useItemsStore();

    useEffect(() => {
        const prevItems = prevSelectedItemIds.current;
        const prevParams = prevSelectedParameterIds.current;

        const itemsChanged =
            selectedItemIds.length !== prevItems.length || selectedItemIds.some((id, i) => id !== prevItems[i]);
        const paramsChanged =
            selectedParameterIds.length !== prevParams.length || selectedParameterIds.some((id, i) => id !== prevParams[i]);

        if (itemsChanged && selectedItemIds.length > 0 && selectedParameterIds.length > 0) {
            setSelectedParameterIds([]);
        }

        if (paramsChanged && selectedParameterIds.length > 0 && selectedItemIds.length > 0) {
            setSelectedItemIds([]);
        }

        prevSelectedItemIds.current = selectedItemIds;
        prevSelectedParameterIds.current = selectedParameterIds;
    }, [selectedItemIds, selectedParameterIds, setSelectedParameterIds, setSelectedItemIds]);

    const isSceneSelected =
        mounted && selectedItemIds.length === 1 && currentSceneId && selectedItemIds[0] === currentSceneId;
    const selectedScene = isSceneSelected && currentSceneId ? scenes[currentSceneId] : null;

    const selectedItem = mounted && !isSceneSelected && selectedItemIds.length === 1 ? getSelectedItem() : null;
    const selectedParameter = mounted && !selectedItem && selectedParameterIds.length === 1 ? getSelectedParameter() : null;

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    if (!mounted) {
        return <EmptyState message="Загрузка..." />;
    }

    if (isSceneSelected && selectedScene) {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3 w-full h-full">
                <InspectorScene scene={selectedScene} />
            </div>
        );
    }

    if (selectedItem) {
        if (selectedItem.kind === 'node') {
            return (
                <div className="overflow-y-auto mt-1 border-t border-depth-3 w-full h-full">
                    <InspectorNode node={selectedItem} items={items} />
                </div>
            );
        }

        if (selectedItem.kind === 'edge') {
            return (
                <div className="overflow-y-auto mt-1 border-t border-depth-3 w-full h-full">
                    <InspectorEdge edge={selectedItem} items={items} />
                </div>
            );
        }
    }

    if (selectedParameter) {
        return (
            <div className="overflow-y-auto mt-1 border-t border-depth-3 w-full h-full">
                <InspectorParameter parameter={selectedParameter} />
            </div>
        );
    }

    return <EmptyState message="Необходимо выбрать один элемент или параметр" className="w-full" />;
});
