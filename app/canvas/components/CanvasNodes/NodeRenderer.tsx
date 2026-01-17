import type { Node } from '@/canvas/canvas.types';

import { getShape } from '@/canvas/utils/nodes/getShape';
import { NODE_SIZE } from '@/canvas/canvas.constants';

interface NodeRendererProps {
    node: Node;
    isSelected: boolean;
}

export function NodeRenderer({ node, isSelected }: NodeRendererProps) {
    const shape = getShape(node.shapeType);
    const Icon = shape.icon;
    const isPoint = node.shapeType === 'point';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <Icon
                className={`w-max fill-depth-1 hover:cursor-move active:cursor-grabbing 
                    ${isPoint ? 'stroke-[2px]' : 'stroke-[1.5px]'} 
                    ${isSelected ? 'text-bg-accent' : 'text-foreground'}
                `}
                width={NODE_SIZE}
                height={NODE_SIZE}
            />
        </div>
    );
}
