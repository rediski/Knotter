'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { SelectionBox } from '@/components/canvas/CanvasSelectionBox';
import { Coordinates } from '@/components/scene/Coordinates';
import { Node } from '@/_core/Node';

import { useItemsStore } from '@/store/useItemsStore';

import { useCanvasRenderer } from '@/_core/Canvas/useCanvasRenderer';
import { useCanvasInteraction } from '@/_core/Canvas/useCanvasInteraction';
import { useCanvasHotkeys } from '@/_core/Canvas/useCanvasHotkeys';

import { getNodes } from '@/utils/nodes/getNodes';
import { addSelectedParametersToNode } from '@/utils/nodes/addSelectedParametersToNode';

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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        try {
            const data = e.dataTransfer.getData('text/plain');
            const parameterIds = JSON.parse(data);

            if (Array.isArray(parameterIds) && parameterIds.length > 0) {
                addSelectedParametersToNode(nodeId, parameterIds);
            }
        } catch (error) {
            console.error('Failed to parse drag data:', error);
        }
    };

    return (
        <div className="flex gap-1 w-full h-full">
            <div
                ref={containerRef}
                className="relative bg-depth-1 min-w-3xl w-full rounded-lg border border-depth-3 overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
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
            </div>
        </div>
    );
}
