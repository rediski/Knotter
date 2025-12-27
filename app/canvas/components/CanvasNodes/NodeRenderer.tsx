import { useEffect, useRef } from 'react';

import { EditableName } from '@/components/UI/EditableName';
import { NodeParameters } from '@/canvas/components/CanvasNodes/NodeParameters';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

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

    const { сhangeItemName } = useInspector();

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
                relative flex flex-col gap-1 max-w-96 min-w-16 w-max border-1 rounded-lg bg-depth-1 text-sm hover:cursor-move active:cursor-grabbing p-2 shadow-lg
                ${isSelected ? 'border-bg-accent' : 'border-depth-4'} 
            `}
        >
            <EditableName
                name={node.name}
                onChange={сhangeItemName}
                className="flex items-center bg-depth-2 rounded-md px-3 text-foreground outline-none w-full tabular-nums h-8 hover:cursor-move"
            />

            {node.description && (
                <div className="flex flex-wrap items-center px-3 py-1 rounded-md bg-depth-2 min-h-8 text-foreground overflow-x-auto">
                    {node.description}
                </div>
            )}

            <NodeParameters node={node} />
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
