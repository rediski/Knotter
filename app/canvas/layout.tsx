import { ReactNode } from 'react';

import { CanvasWrapper } from '@/canvas/_core/Canvas/CanvasWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Холст',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col h-screen w-screen bg-background" translate="no">
            <div className="flex flex-1 min-h-0 overflow-hidden m-1">
                <div className="flex-1 min-w-0 relative">
                    <div className="flex flex-col gap-1 h-full">
                        <CanvasWrapper>{children}</CanvasWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
}
