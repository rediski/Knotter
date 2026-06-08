import type { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { Breadcrumbs } from '@/components/scene/Breadcrumbs';
import { SceneList } from '@/components/scene/SceneList';

import { Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Холст',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full h-screen bg-background p-1 overflow-x-hidden" translate="no">
            <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center gap-1">
                    <Link
                        href="/"
                        className="flex items-center w-8 h-8 p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 cursor-pointer"
                    >
                        <Home size={16} />
                    </Link>

                    <ThemeToggle />

                    <hr className="h-6 mx-1 border-l border-depth-3" />

                    <Breadcrumbs />
                    <SceneList />
                </div>

                {children}
            </div>

            <Sidebar />
        </div>
    );
}
