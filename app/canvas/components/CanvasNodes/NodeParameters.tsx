'use client';

import { memo } from 'react';
import { Node } from '@/canvas/canvas.types';

interface NodeParametersProps {
    node: Node;
}

export const NodeParameters = memo(function NodeParameters({ node }: NodeParametersProps) {
    const parameters = node?.nodeParameters;

    return (
        <div className="flex flex-col gap-1">
            {parameters.map((parameter) => {
                return (
                    <div key={parameter.id}>
                        <span>{parameter.name}</span>
                    </div>
                );
            })}
        </div>
    );
});
