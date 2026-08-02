'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { MAX_SCENES } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';
import { useSceneListStore } from '@/store/useSceneListStore';

import { EditableName } from '@/components/UI/EditableName';

import { createScene } from '@/utils/scene/createScene';
import { deleteScene } from '@/utils/scene/deleteScene';
import { changeSceneName } from '@/utils/scene/changeSceneName';

import { LandPlot, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function SceneList() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const isRestoredRef = useRef(false);

    const scenes = useItemsStore((state) => state.scenes);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const setCurrentSceneId = useItemsStore((state) => state.setCurrentSceneId);

    const currentNodeId = useItemsStore((state) => state.currentNodeId);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollPosition = useSceneListStore((state) => state.scrollPosition);
    const setScrollPosition = useSceneListStore((state) => state.setScrollPosition);

    const sceneIds = Object.keys(scenes);
    const hasMultipleScenes = sceneIds.length > 1;
    const canAddScene = sceneIds.length >= MAX_SCENES;

    const checkScrollPosition = () => {
        const scrollableElement = containerRef.current;
        if (!scrollableElement) return;

        const currentScrollPosition = scrollableElement.scrollLeft;
        const maxScrollPosition = scrollableElement.scrollWidth - scrollableElement.clientWidth;
        const scrollTolerance = 1;

        setCanScrollLeft(currentScrollPosition > 0);
        setCanScrollRight(currentScrollPosition < maxScrollPosition - scrollTolerance);
    };

    const saveCurrentScrollPosition = () => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const currentHorizontalOffset = scrollContainer.scrollLeft;
        setScrollPosition(currentHorizontalOffset);
    };

    const scroll = (direction: 'left' | 'right') => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const scrollAmount = 196 * 3;

        scrollContainer.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });

        setTimeout(() => {
            checkScrollPosition();
            saveCurrentScrollPosition();
        }, 400);
    };

    useEffect(() => {
        if (isRestoredRef.current) return;

        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        requestAnimationFrame(() => {
            const hasSavedPosition = scrollPosition > 0;
            if (hasSavedPosition) {
                scrollContainer.scrollLeft = scrollPosition;
            }

            checkScrollPosition();
            isRestoredRef.current = true;
        });
    }, [scrollPosition]);

    const handleScroll = () => {
        checkScrollPosition();
        saveCurrentScrollPosition();
    };

    useLayoutEffect(() => {
        checkScrollPosition();
    }, [scenes, currentSceneId]);

    if (currentNodeId) return null;

    const handleCreateScene = async () => {
        const sceneId = await createScene();
        if (sceneId) {
            router.push(`/${sceneId}`);
        }
    };

    const handleSelectScene = (sceneId: string) => {
        setCurrentSceneId(sceneId);
        window.history.pushState({ path: `/${sceneId}` }, '', `/${sceneId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, sceneId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (deleteScene(sceneId)) {
            const nextSceneId = sceneIds.filter((id) => id !== sceneId).find((id) => id);

            router.push(`/${nextSceneId ?? ''}`);
        }
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

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-1 max-h-8 scrollbar-hide flex-1 min-w-0"
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
                                group cursor-pointer shrink-0
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

                            <EditableName
                                name={scene?.name ?? ''}
                                onChange={(newName) => changeSceneName(sceneId, newName)}
                                isSelected={isActive}
                                className="flex-1 min-w-0"
                            />

                            {hasMultipleScenes && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, sceneId)}
                                    className={`
                                        opacity-0 group-hover:opacity-100 rounded p-0.5 border cursor-pointer shrink-0
                                        ${currentSceneId === sceneId ? 'bg-bg-accent/10 hover:bg-bg-accent/15 border-bg-accent/10' : 'bg-depth-4 hover:bg-depth-5 border-depth-5'}
                                    `}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-md border  shrink-0
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
    );
}
