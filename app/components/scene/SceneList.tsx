'use client';

import { useRouter } from 'next/navigation';

import { LandPlot, Plus } from 'lucide-react';
import { createScene } from '@/utils/scene/createScene';
import { useItemsStore } from '@/store/useItemsStore';
import Link from 'next/link';

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

    const sceneIds = Object.keys(scenes);

    return (
        <>
            <div className="flex items-center gap-1">
                {sceneIds.map((sceneId) => {
                    const scene = scenes[sceneId];
                    return (
                        <Link
                            key={sceneId}
                            href={`/${sceneId}`}
                            onClick={() => handleSelectScene(sceneId)}
                            className={`
                                flex items-center gap-1 px-3 py-1.5 min-w-64 rounded-md border cursor-pointer
                                ${
                                    currentSceneId === sceneId
                                        ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent'
                                        : 'bg-depth-2 border-depth-3 hover:bg-depth-3'
                                }
                            `}
                        >
                            <LandPlot size={16} />

                            <hr
                                className={`
                                    h-5 mx-1 border-l
                                    ${currentSceneId === scene.id ? 'border-bg-accent/10' : 'border-depth-3'}
                                `}
                            />

                            <span className="text-sm">{scene?.name}</span>
                        </Link>
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
