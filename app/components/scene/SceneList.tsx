'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const isScrollingRef = useRef(false);
    const isInitialScrollDone = useRef(false);

    const currentPage = useSceneListStore((state) => state.currentPage);
    const setCurrentPage = useSceneListStore((state) => state.setCurrentPage);

    const scenes = useItemsStore((state) => state.scenes);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const setCurrentSceneId = useItemsStore((state) => state.setCurrentSceneId);
    const { currentNodeId } = useItemsStore();

    if (currentNodeId) return null;

    const sceneIds = Object.keys(scenes);
    const hasMultipleScenes = sceneIds.length > 1;
    const canAddScene = sceneIds.length >= MAX_SCENES;

    const ITEMS_PER_PAGE = 3;

    const calculatedMaxPage = useMemo(() => {
        const totalItems = sceneIds.length;
        if (totalItems <= ITEMS_PER_PAGE) return 0;

        const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE) - 1;

        return maxPage;
    }, [sceneIds.length]);

    const getCurrentPage = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return 0;

        const containerRect = container.getBoundingClientRect();
        const containerLeftEdge = containerRect.left;

        let firstVisibleItemIndex = 0;
        let minimumDistance = Infinity;

        for (let index = 0; index < sceneIds.length; index++) {
            const element = itemRefs.current.get(sceneIds[index]);
            if (!element) continue;

            const elementRect = element.getBoundingClientRect();
            const distanceFromContainerLeft = Math.abs(elementRect.left - containerLeftEdge);

            if (distanceFromContainerLeft < minimumDistance) {
                minimumDistance = distanceFromContainerLeft;
                firstVisibleItemIndex = index;
            }
        }

        const currentPage = Math.floor(firstVisibleItemIndex / ITEMS_PER_PAGE);

        return currentPage;
    }, [sceneIds]);

    const checkScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

        if (!isScrollingRef.current) {
            const page = getCurrentPage();
            setCurrentPage(Math.min(page, calculatedMaxPage));
        }
    }, [getCurrentPage, calculatedMaxPage, setCurrentPage]);

    useEffect(() => {
        const restoreScroll = () => {
            if (isInitialScrollDone.current) return;
            if (sceneIds.length === 0) return;

            const targetIndex = currentPage * ITEMS_PER_PAGE;
            const targetId = sceneIds[targetIndex];
            const targetElement = itemRefs.current.get(targetId);

            if (targetElement) {
                isScrollingRef.current = true;

                targetElement.scrollIntoView({
                    behavior: 'instant',
                    block: 'nearest',
                    inline: 'start',
                });

                setTimeout(() => {
                    isScrollingRef.current = false;
                    isInitialScrollDone.current = true;
                    checkScroll();
                }, 100);

                return;
            }

            setTimeout(restoreScroll, 100);
        };

        const timer = setTimeout(restoreScroll, 50);

        return () => clearTimeout(timer);
    }, [sceneIds, currentPage, checkScroll]);

    useEffect(() => {
        const timer = setTimeout(() => {
            checkScroll();
        }, 50);

        window.addEventListener('resize', checkScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScroll);
        };
    }, [sceneIds, checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;

        if (!container) return;

        let newPage = currentPage;

        if (direction === 'left') {
            newPage = Math.max(0, currentPage - 1);
        }

        if (direction === 'right') {
            newPage = Math.min(calculatedMaxPage, currentPage + 1);
        }

        if (newPage === currentPage) return;

        isScrollingRef.current = true;
        setCurrentPage(newPage);

        const targetIndex = newPage * ITEMS_PER_PAGE;
        const targetId = sceneIds[targetIndex];
        const targetElement = itemRefs.current.get(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });
        }

        setTimeout(() => {
            isScrollingRef.current = false;
            checkScroll();
        }, 500);
    };

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
                disabled={!canScrollLeft || currentPage === 0}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-md border shrink-0
                    ${
                        canScrollLeft && currentPage > 0
                            ? 'bg-depth-2 hover:bg-depth-3 border-depth-3 cursor-pointer'
                            : 'bg-depth-1 border-depth-2 opacity-30 cursor-default'
                    }
                `}
                title="Прокрутить влево"
            >
                <ChevronLeft size={16} />
            </button>

            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-1 max-h-8 scrollbar-hide flex-1 min-w-0"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    maxWidth: 'calc(192px * 3 + 4px * 2)',
                }}
            >
                {sceneIds.map((sceneId) => {
                    const scene = scenes[sceneId];

                    return (
                        <div
                            key={sceneId}
                            ref={(el) => {
                                if (el) {
                                    itemRefs.current.set(sceneId, el);
                                } else {
                                    itemRefs.current.delete(sceneId);
                                }
                            }}
                            className={`
                                flex items-center gap-1 px-3 py-1.25 min-w-48 rounded-md border group cursor-pointer shrink-0
                                ${
                                    currentSceneId === sceneId
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
                                isSelected={currentSceneId === sceneId}
                                className="flex-1 min-w-0"
                                disabled={false}
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
                disabled={!canScrollRight || currentPage === calculatedMaxPage}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-md border  shrink-0
                    ${
                        canScrollRight && currentPage < calculatedMaxPage
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
