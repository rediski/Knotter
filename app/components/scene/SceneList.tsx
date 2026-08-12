'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';

import { MAX_SCENES } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';
import { useSceneListStore } from '@/store/useSceneListStore';

import { ScenePagination } from '@/components/scene/ScenePagination';

import { createScene } from '@/utils/scene/createScene';
import { deleteScene } from '@/utils/scene/deleteScene';

import { LandPlot, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function SceneList() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isRestoredRef = useRef(false);
    const prevScrollLeftRef = useRef(0);
    const isScrollingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scenes = useItemsStore((state) => state.scenes);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const setCurrentSceneId = useItemsStore((state) => state.setCurrentSceneId);

    const currentNodeId = useItemsStore((state) => state.currentNodeId);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

    const scrollPosition = useSceneListStore((state) => state.scrollPosition);
    const setScrollPosition = useSceneListStore((state) => state.setScrollPosition);

    const sceneIds = Object.keys(scenes);
    const hasMultipleScenes = sceneIds.length > 1;
    const canAddScene = sceneIds.length >= MAX_SCENES;

    const calculateVisibleRange = () => {
        const scrollableElement = containerRef.current;
        if (!scrollableElement) return { start: 0, end: 0 };

        const totalItems = sceneIds.length;
        if (totalItems === 0) return { start: 0, end: 0 };

        const maxScrollPosition = scrollableElement.scrollWidth - scrollableElement.clientWidth;
        if (maxScrollPosition <= 0) {
            return { start: 0, end: Math.min(3, totalItems) };
        }

        const currentScrollPosition = scrollableElement.scrollLeft;
        const scrollRatio = currentScrollPosition / maxScrollPosition;
        const maxStartIndex = Math.max(0, totalItems - 3);
        const startIndex = Math.round(scrollRatio * maxStartIndex);
        const endIndex = Math.min(totalItems, startIndex + 3);

        return { start: startIndex, end: endIndex };
    };

    const checkScrollPosition = () => {
        const scrollableElement = containerRef.current;
        if (!scrollableElement) return;

        const currentScrollPosition = scrollableElement.scrollLeft;
        const maxScrollPosition = scrollableElement.scrollWidth - scrollableElement.clientWidth;
        const scrollTolerance = 1;

        setCanScrollLeft(currentScrollPosition > 0);
        setCanScrollRight(currentScrollPosition < maxScrollPosition - scrollTolerance);

        const newRange = calculateVisibleRange();
        prevScrollLeftRef.current = currentScrollPosition;
        setVisibleRange(newRange);
    };

    const saveCurrentScrollPosition = () => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        setScrollPosition(scrollContainer.scrollLeft);
    };

    const scroll = (direction: 'left' | 'right') => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const scrollAmount = 196 * 3;
        scrollContainer.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;

        checkScrollPosition();
        saveCurrentScrollPosition();
    };

    useEffect(() => {
        if (isRestoredRef.current) return;

        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        requestAnimationFrame(() => {
            if (scrollPosition > 0) {
                scrollContainer.scrollLeft = scrollPosition;
            }

            prevScrollLeftRef.current = scrollContainer.scrollLeft;
            checkScrollPosition();
            isRestoredRef.current = true;
        });
    }, [scrollPosition]);

    const handleScroll = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        isScrollingRef.current = true;

        timeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            checkScrollPosition();
            saveCurrentScrollPosition();
        }, 50);

        checkScrollPosition();
        saveCurrentScrollPosition();
    };

    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            if (!isScrollingRef.current) {
                checkScrollPosition();
            }
        });
    }, [scenes, currentSceneId]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (currentNodeId) return null;

    const handleCreateScene = async () => {
        const sceneId = await createScene();
        if (sceneId) {
            setCurrentSceneId(sceneId);
            window.history.pushState({ path: `/${sceneId}` }, '', `/${sceneId}`);
        }
    };

    const handleSelectScene = (sceneId: string) => {
        setCurrentSceneId(sceneId);
        window.history.pushState({ path: `/${sceneId}` }, '', `/${sceneId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, sceneId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!deleteScene(sceneId)) return;

        const nextSceneId = sceneIds.filter((id) => id !== sceneId).find((id) => id);
        const isDeletingCurrentScene = currentSceneId === sceneId;

        if (!isDeletingCurrentScene) return;

        if (nextSceneId) {
            setCurrentSceneId(nextSceneId);
            window.history.pushState({ path: `/${nextSceneId}` }, '', `/${nextSceneId}`);
            return;
        }

        setCurrentSceneId(null);
        window.history.pushState({ path: '/' }, '', '/');
    };

    const scrollToScene = (index: number) => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const itemWidth = 196;
        scrollContainer.scrollLeft = index * itemWidth;

        checkScrollPosition();
        saveCurrentScrollPosition();
    };

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-md border shrink-0
                    ${
                        canScrollLeft
                            ? 'bg-depth-2 hover:bg-depth-3 border-depth-3 cursor-pointer'
                            : 'bg-depth-1 border-depth-2 opacity-30 cursor-default'
                    }
                `}
                title="Прокрутить влево"
            >
                <ChevronLeft size={16} />
            </button>

            <div className="relative flex-1 min-w-0">
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto gap-1 max-h-8 scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        maxWidth: 'calc(192px * 3 + 4px * 2)',
                    }}
                >
                    {sceneIds.map((sceneId) => {
                        const scene = scenes[sceneId];
                        const isActive = currentSceneId === sceneId;

                        return (
                            <div
                                key={sceneId}
                                className={`
                                    flex items-center gap-1 px-3 py-1.25 min-w-48 rounded-md border 
                                    group cursor-pointer select-none
                                    ${
                                        isActive
                                            ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent'
                                            : 'bg-depth-2 border-depth-3 hover:bg-depth-3'
                                    }
                                `}
                                onClick={() => handleSelectScene(sceneId)}
                            >
                                <LandPlot size={16} className="min-w-4" />

                                <hr
                                    className={`
                                        h-5 mx-1 border-l
                                        ${currentSceneId === sceneId ? 'border-bg-accent/10' : 'border-depth-5'}
                                    `}
                                />

                                <span
                                    className={`text-sm w-full max-w-27.5 truncate
                                    ${currentSceneId === sceneId ? 'text-text-accent' : 'text-foreground'}
                                    `}
                                >
                                    {scene.name}
                                </span>

                                {hasMultipleScenes && (
                                    <button
                                        onClick={(e) => handleDeleteClick(e, sceneId)}
                                        className={`
                                            opacity-0 group-hover:opacity-100 rounded p-0.5 border cursor-pointer shrink-0
                                            ${
                                                currentSceneId === sceneId
                                                    ? 'bg-bg-accent/10 hover:bg-bg-accent/15 border-bg-accent/10'
                                                    : 'bg-depth-4 hover:bg-depth-5 border-depth-5'
                                            }
                                        `}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <ScenePagination totalItems={sceneIds.length} visibleRange={visibleRange} onScrollToScene={scrollToScene} />
            </div>

            <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-md border shrink-0
                    ${
                        canScrollRight
                            ? 'bg-depth-2 hover:bg-depth-3 border-depth-3 cursor-pointer'
                            : 'bg-depth-1 border-depth-2 opacity-30 cursor-default'
                    }
                `}
                title="Прокрутить вправо"
            >
                <ChevronRight size={16} />
            </button>

            <div className="flex items-center gap-2 ml-1">
                <button
                    onClick={handleCreateScene}
                    disabled={canAddScene}
                    className={`
                        flex items-center justify-center w-8 h-8 p-2 rounded-md border shrink-0
                        ${
                            canAddScene
                                ? 'bg-depth-1 border-depth-2 opacity-50 cursor-not-allowed'
                                : 'bg-depth-2 hover:bg-depth-3 border-depth-3 cursor-pointer'
                        }
                    `}
                    title={canAddScene ? `Достигнут лимит сцен (${MAX_SCENES})` : 'Создать сцену'}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
