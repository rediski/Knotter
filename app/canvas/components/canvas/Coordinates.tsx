'use client';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { getCanvasCenter } from '@/canvas/utils/canvas/getCanvasCenter';

import { RotateCcw } from 'lucide-react';

export const Coordinates = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) => {
    const offset = useCanvasStore((state) => state.offset);
    const setOffset = useCanvasStore((state) => state.setOffset);

    const center = getCanvasCenter(canvasRef);

    return (
        <div className="absolute bottom-4 left-4 flex gap-1 z-10 text-sm select-none">
            <button
                className="bg-depth-2 hover:bg-depth-3 rounded-md p-2 shadow w-fit cursor-pointer"
                onClick={() => center && setOffset(center)}
                disabled={!center}
            >
                <RotateCcw size={16} />
            </button>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <div className="bg-depth-2 rounded-md px-3 py-1 shadow w-fit min-w-[9ch] tabular-nums">
                        X: {offset.x.toFixed(0)}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <div className="bg-depth-2 rounded-md px-3 py-1 shadow w-fit min-w-[9ch] tabular-nums">
                        Y: {offset.y.toFixed(0)}
                    </div>
                </div>
            </div>
        </div>
    );
};
