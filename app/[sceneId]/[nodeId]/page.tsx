'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { NodeParameters } from '@/_core/Node/NodeParameters';

import { useItemsStore } from '@/store/useItemsStore';
import { getNodes } from '@/utils/nodes/getNodes';
import { useCanvasRenderer } from '@/_core/Canvas/useCanvasRenderer';
import { useCanvasInteraction } from '@/_core/Canvas/useCanvasInteraction';
import { useCanvasHotkeys } from '@/_core/Canvas/useCanvasHotkeys';
import { SelectionBox } from '@/components/canvas/CanvasSelectionBox';
import { Coordinates } from '@/components/scene/Coordinates';
import { Node } from '@/_core/Node';

export default function NodePage() {
    const params = useParams();
    const nodeId = params.nodeId as string;
    const router = useRouter();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    useCanvasInteraction({ containerRef, canvasRef });
    useCanvasHotkeys(canvasRef);
    useCanvasRenderer(canvasRef);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const openedNode = nodes.find((item) => item.id === nodeId && item.kind === 'node');

    if (!openedNode) return null;

    return (
        <div className="flex gap-1 w-full h-full">
            <div
                ref={containerRef}
                className="relative bg-depth-1 min-w-3xl w-full rounded-lg border border-depth-3 overflow-hidden"
            >
                <Coordinates canvasRef={canvasRef} />

                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full bg-depth-1 rounded-md border border-depth-3"
                />

                <SelectionBox containerRef={containerRef} />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Node containerRef={containerRef} isNodePage={true} nodeId={nodeId} />
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-auto">
                    <div className="flex flex-col gap-1 text-sm w-full">
                        <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1 w-full shadow-xs">
                            <NodeParameters nodeParameters={openedNode.parameters} nodeId={openedNode.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
