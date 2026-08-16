'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { NODE_SHAPES } from '@/_core/_/nodeShapeType';

import { NodeParameters } from '@/_core/Node/NodeParameters';

import { useItemsStore } from '@/store/useItemsStore';
import { getNodes } from '@/utils/nodes/getNodes';

export default function NodePage() {
    const params = useParams();
    const nodeId = params.nodeId as string;
    const router = useRouter();

    const { currentSceneId, scenes, currentNodeId, setCurrentNodeIds } = useItemsStore();

    useEffect(() => {
        if (nodeId && currentNodeId !== nodeId) {
            setCurrentNodeIds(nodeId);
        }
    }, [nodeId, currentNodeId, setCurrentNodeIds]);

    useEffect(() => {
        const unsubscribe = useItemsStore.subscribe((state) => {
            const currentNodeId = state.currentNodeId;
            const currentSceneId = state.currentSceneId;

            if (!currentNodeId || currentSceneId) {
                const scenes = state.scenes;
                const scene = currentSceneId ? scenes[currentSceneId] : null;
                const items = scene?.items ?? [];
                const nodes = getNodes(items);

                const nodeExists = nodes.find((item) => item.id === nodeId);

                if (!nodeExists) {
                    if (currentSceneId) {
                        router.push(`/${currentSceneId}/`);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [nodeId, router]);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const openedNode = nodes.find((item) => item.id === nodeId && item.kind === 'node');

    if (!openedNode) return null;

    const Icon = NODE_SHAPES[openedNode.shapeType]?.icon;
    if (!Icon) return null;

    return (
        <div className="flex gap-1 w-full h-full">
            <div
                className="bg-depth-1 min-w-3xl w-full rounded-lg border border-depth-3 overflow-hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                    `,
                    backgroundSize: '128px 128px',
                }}
            >
                <div className="relative pt-84 flex flex-col items-center gap-4 min-w-md w-full h-fit overflow-y-auto">
                    <div className="ml-px flex items-center justify-center shrink-0">
                        {Icon && (
                            <Icon
                                size={96}
                                className="fill-depth-1"
                                strokeWidth={openedNode.shapeType === 'point' ? 2.5 : 1.5}
                                style={{ color: openedNode.color ?? 'var(--color-foreground)' }}
                            />
                        )}
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="flex flex-col gap-1 text-sm w-full">
                            {openedNode.parameters.length > 0 && (
                                <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1 w-full max-h-105 overflow-y-auto shadow">
                                    {openedNode.parameters.map((nodeParameter) => (
                                        <NodeParameters
                                            key={nodeParameter.id}
                                            nodeParameter={nodeParameter}
                                            nodeId={openedNode.id}
                                        />
                                    ))}
                                </div>
                            )}

                            {openedNode.parameters.length === 0 && (
                                <div className="flex items-center justify-center bg-depth-1 border border-depth-3 rounded-md">
                                    <div className="text-sm text-gray bg-depth-2 w-full p-4 m-1 rounded-md border border-depth-3 text-center">
                                        Нет добавленных параметров
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                    <h2 className="wrap-break-word text-base w-fit h-fit bg-depth-2 border border-depth-3 rounded-md px-3 py-1">
                        {openedNode.name || '...'}
                    </h2>

                    <p className="wrap-break-word text-gray text-base w-fit flex-1 max-w-lg min-w-xs h-fit max-h-54.5 bg-depth-2 border border-depth-3 rounded-md px-3 py-1 overflow-y-auto">
                        {openedNode.description || '...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
