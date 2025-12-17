import { useEffect, useRef } from 'react';

import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getShape } from '@/canvas/utils/nodes/getShape';

import { NODE_SIZE } from '@/canvas/canvas.constants';

import { EditorMode, Node } from '@/canvas/canvas.types';

interface NodeRendererProps {
    node: Node;
    isSelected: boolean;
    editorMode: EditorMode;
}

interface NodeProps {
    node: Node;
    isSelected: boolean;
}

export function NodeRenderer({ node, isSelected, editorMode }: NodeRendererProps) {
    return editorMode === 'edit' ? (
        <EditMode node={node} isSelected={isSelected} />
    ) : (
        <ViewMode node={node} isSelected={isSelected} />
    );
}

function EditMode({ node, isSelected }: NodeProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);

    useEffect(() => {
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();

            const logicalWidth = rect.width / zoomLevel;
            const logicalHeight = rect.height / zoomLevel;

            node.width = logicalWidth;
            node.height = logicalHeight;
        }
    }, [node, zoomLevel]);

    return (
        <div
            ref={nodeRef}
            className={`
                relative flex flex-col gap-1 max-w-96 min-w-16 w-max border-1 rounded-lg bg-background text-sm p-1 hover:cursor-move active:cursor-grabbing
                ${isSelected ? 'border-bg-accent' : 'border-depth-4'} 
            `}
        >
            <div className="rounded-t-md flex items-center truncate w-full px-3 py-1 rounded-md bg-depth-1">{node.name}</div>

            {node.description && (
                <div className="px-3 py-1 rounded-md bg-depth-1 text-foreground overflow-hidden break-words">
                    {node.description}
                </div>
            )}

            {node.nodeParameters.length > 0 && <NodeParameters node={node} />}
        </div>
    );
}

function ViewMode({ node, isSelected }: NodeProps) {
    const shape = getShape(node.shapeType);
    const Icon = shape.icon;
    const isPoint = node.shapeType === 'point';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <Icon
                className={`w-max fill-background hover:cursor-move active:cursor-grabbing 
                    ${isPoint ? 'stroke-[2px]' : 'stroke-[1.5px]'} 
                    ${isSelected ? 'text-bg-accent' : 'text-foreground'}
                `}
                width={NODE_SIZE}
                height={NODE_SIZE}
            />
        </div>
    );
}
