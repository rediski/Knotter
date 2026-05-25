'use client';

import { useRouter } from 'next/navigation';

import { useItemsStore } from '@/store/useItemsStore';

import { createScene } from '@/utils/scene/createScene';
import { deleteScene } from '@/utils/scene/deleteScene';

import { LandPlot, Plus, X } from 'lucide-react';

export function SceneList() {
    const router = useRouter();
    const scenes = useItemsStore((state) => state.scenes);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const setCurrentSceneId = useItemsStore((state) => state.setCurrentSceneId);
    const { currentNodeId } = useItemsStore();

    if (currentNodeId) return null;

    const handleCreateScene = async () => {
        const sceneId = await createScene();
        if (sceneId) {
            router.push(`/${sceneId}`);
        }
    };

    const handleSelectScene = (sceneId: string) => {
        setCurrentSceneId(sceneId);
        router.push(`/${sceneId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, sceneId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (deleteScene(sceneId)) {
            const nextSceneId = sceneIds.filter((id) => id !== sceneId).find((id) => id);

            router.push(`/${nextSceneId ?? ''}`);
        }
    };

    const sceneIds = Object.keys(scenes);
    const hasMultipleScenes = sceneIds.length > 1;

    return (
        <>
            <div className="flex items-center gap-1">
                {sceneIds.map((sceneId) => {
                    const scene = scenes[sceneId];

                    return (
                        <div
                            key={sceneId}
                            className={`
                                flex items-center gap-1 px-3 py-1.25 min-w-64 rounded-md border group cursor-pointer
                                ${
                                    currentSceneId === sceneId
                                        ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent'
                                        : 'bg-depth-2 border-depth-3 hover:bg-depth-3'
                                }
                            `}
                            onClick={() => handleSelectScene(sceneId)}
                        >
                            <LandPlot size={16} />

                            <hr
                                className={`
                                    h-5 mx-1 border-l
                                    ${currentSceneId === sceneId ? 'border-bg-accent/10' : 'border-depth-3'}
                                `}
                            />

                            <span className="text-sm flex-1">{scene?.name}</span>

                            {hasMultipleScenes && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, sceneId)}
                                    className={`
                                        opacity-0 group-hover:opacity-100 rounded p-0.5 transition-opacity border cursor-pointer 
                                        ${currentSceneId === sceneId ? 'bg-bg-accent/10 hover:bg-bg-accent/15 border-bg-accent/10' : 'bg-depth-4 hover:bg-depth-5 border-depth-5'}`}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handleCreateScene}
                className="flex items-center w-8 h-8 p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 cursor-pointer"
            >
                <Plus size={16} />
            </button>
        </>
    );
}
