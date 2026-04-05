'use client';

import { NodeParameters } from '@/canvas/_core/Node/NodeParameters';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';

export default function NodeContent() {
    const items = useItemsStore((state) => state.items);
    const selectedTabId = useCanvasStore((state) => state.selectedTabId);

    const openedNode = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (openedNode?.kind !== 'node') return null;

    const shapeInfo = NODE_SHAPES[openedNode.shapeType as keyof typeof NODE_SHAPES];
    const Icon = shapeInfo?.icon;

    return (
        <div className="flex gap-1 w-full overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-1">
                <div
                    className={`flex items-center justify-center bg-depth-1 w-full max-h-64 max-w-64 min-w-64 aspect-square rounded-lg border border-depth-3 overflow-hidden`}
                    style={{
                        backgroundImage: `
                        linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                    `,
                        backgroundSize: '64px 64px',
                        backgroundPosition: `-1.5px -1.5px`,
                        backgroundRepeat: 'repeat',
                    }}
                >
                    <Icon
                        size={64}
                        className="flex items-center justify-center fill-depth-1"
                        strokeWidth={openedNode.shapeType === 'point' ? 2 : 1.5}
                    />
                </div>

                <div className="flex flex-col max-w-64 h-fit bg-depth-1 border border-depth-3 rounded-md text-sm px-3 py-1">
                    <h2 className="wrap-break-word text-base">{openedNode.name || '...'}</h2>

                    <p className="wrap-break-word text-gray text-sm">{openedNode.description || '...'}</p>
                </div>
            </div>

            <NodeParameters node={openedNode} />
        </div>
    );
}
