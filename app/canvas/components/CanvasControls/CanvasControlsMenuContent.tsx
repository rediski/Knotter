import { memo } from 'react';

import Link from 'next/link';

import { ThemeToggle } from '@/components/ThemeToggle';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { FlipVertical2, Home } from 'lucide-react';

export const MenuContent = memo(function MenuContent() {
    const invertY = useCanvasStore((state) => state.invertY);
    const setInvertY = useCanvasStore((state) => state.setInvertY);

    return (
        <div className="flex flex-col bg-depth-1 rounded-md shadow w-full text-nowrap">
            <div className="flex flex-col gap-1 m-1">
                <button
                    onClick={() => setInvertY(!invertY)}
                    className="px-3 py-2 w-full flex justify-between bg-depth-2 hover:bg-depth-3 rounded-md cursor-pointer"
                >
                    Инвертировать Y
                    <FlipVertical2 size={16} className={`${invertY ? 'text-foreground' : 'text-gray'}`} />
                </button>

                <ThemeToggle label="Ночной режим" className="px-3 py-2 w-full flex justify-between" />
            </div>

            <hr className="border-b-0 border-depth-3" />

            <div className="m-1">
                <Link
                    href="/"
                    className="flex items-center justify-between gap-2 bg-depth-2 hover:bg-depth-3 px-3 py-2 rounded-md text-red"
                >
                    На главную
                    <Home size={16} />
                </Link>
            </div>
        </div>
    );
});
