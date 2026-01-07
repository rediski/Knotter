'use client';

import Link from 'next/link';

import { ToastProvider } from '@/components/UI/Toast';

import Canvas from '@/canvas/components/Canvas/Canvas';

import { CanvasSidebar } from '@/canvas/components/CanvasSidebar/CanvasSidebar';

import { useMobileDetection } from '@/canvas/hooks/useMobileDetection';

import { LoaderCircle, Frown, X } from 'lucide-react';

export default function CanvasPage() {
    const isMobile = useMobileDetection();

    if (isMobile === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-background w-full">
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle size={24} className="animate-spin" />

                    <p className="text-text-muted">Проверяем размеры экрана...</p>
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="flex flex-col gap-6 h-screen items-center justify-center w-full">
                <div className="flex justify-center items-center flex-col gap-6 max-w-2xl px-4 text-lg text-center">
                    <Frown size={48} className="text-text-accent" />

                    <h1 className="text-6xl font-extrabold uppercase">Упс!</h1>

                    <p className="max-w-2xl text-center text-lg mt-1">
                        Knotter разработан исключительно для ПК. Перейдите на устройство с большим экраном.
                    </p>

                    <Link
                        href="/"
                        className="flex items-center gap-1 px-3 py-1 bg-depth-2 hover:bg-depth-3 border border-depth-3 text-foreground text-base w-fit rounded-md select-none"
                    >
                        Вернуться на главную
                    </Link>
                </div>

                <div className="fixed flex items-center bottom-4 text-xs text-gray text-center">
                    <span>Размер экрана: {window.innerWidth}</span>

                    <X size={12} className="flex items-center justify-center" />

                    <span>{window.innerHeight}px</span>
                </div>
            </div>
        );
    }
    return (
        <ToastProvider>
            <div className="flex overflow-hidden w-full select-none">
                <Canvas />

                <CanvasSidebar />
            </div>
        </ToastProvider>
    );
}
