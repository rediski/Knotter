'use client';

import { memo } from 'react';

import { getShape } from '@/canvas/utils/nodes/getShape';
import { NodeShapeType, NODE_SHAPE_TYPES } from '@/canvas/utils/nodes/getShape';

interface ShapeButtonsProps {
    shapeType: NodeShapeType | null;
    onTypeChange: (type: NodeShapeType) => void;
}

export const ShapeButtons = memo(function ShapeButtons({ shapeType, onTypeChange }: ShapeButtonsProps) {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,min-content))] gap-1">
            {NODE_SHAPE_TYPES.map((type) => {
                const { icon: Icon, label } = getShape(type);
                const isActive = shapeType === type;

                return (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md cursor-pointer max-w-25 w-full focus-visible:outline-0 
                            ${
                                isActive
                                    ? 'text-text-accent bg-bg-accent/10 hover:bg-bg-accent/10 focus-visible:bg-bg-accent/15'
                                    : 'hover:bg-depth-3 focus-visible:bg-border'
                            }
                        `}
                    >
                        <Icon size={24} />

                        <span className="text-xs truncate overflow-hidden w-full text-center">{label}</span>
                    </button>
                );
            })}
        </div>
    );
});
