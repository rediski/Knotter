'use client';

import { useCanvasStore } from '@/store/useCanvasStore';
import { getCanvasCenter } from '@/utils/canvas/getCanvasCenter';

import { MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react';

export const Coordinates = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) => {
    const offset = useCanvasStore((state) => state.offset);
    const setOffset = useCanvasStore((state) => state.setOffset);

    const center = getCanvasCenter(canvasRef);

    return (
        <div className="absolute bottom-4 left-4 z-10 text-sm select-none">
            <div className="flex gap-1 bg-background border border-depth-3 rounded-lg shadow-xs p-1">
                <div className="flex flex-col gap-1 flex-1 text-sm">
                    <div className="flex items-center justify-between gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-0.75">
                        <MoveHorizontal size={14} />

                        <hr className="h-6 mx-1 border-l border-depth-5" />

                        <span className="tabular-nums min-w-[8ch] text-right">{offset.x.toFixed(0)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-depth-2 border border-depth-3 rounded-md px-3 py-0.75">
                        <MoveVertical size={14} />

                        <hr className="h-6 mx-1 border-l border-depth-5" />

                        <span className="tabular-nums min-w-[8ch] text-right">{offset.y.toFixed(0)}</span>
                    </div>
                </div>

                <button
                    onClick={() => center && setOffset(center)}
                    className="flex items-center justify-center w-8 p-1 bg-depth-2 hover:bg-depth-3 border border-depth-3 rounded-md cursor-pointer"
                    title="Сбросить позицию"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};
