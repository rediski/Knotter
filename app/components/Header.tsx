'use client';

import Link from 'next/link';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="sticky top-4 w-full z-50">
            <div className="container flex justify-between items-center bg-depth-1 border border-depth-3 px-6 py-1 rounded-md mx-auto">
                <div className="flex items-center">
                    <Link href="/" className="tracking-wide font-extrabold text-base select-none uppercase">
                        Knotter
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <div className="h-6 border-l border-depth-3" />

                    <Link
                        href="/canvas"
                        className="flex items-center w-fit text-sm px-3 h-8 bg-bg-accent/10 hover:bg-bg-accent/15 border border-bg-accent/15 hover:border-bg-accent/20 transition-colors text-text-accent rounded-lg select-none"
                    >
                        Open Workspace
                    </Link>
                </div>
            </div>

            <div className="fixed top-0 left-0 w-full h-14.5 bg-linear-to-b from-depth-1 to-transparent backdrop-blur-xs -z-1" />
        </header>
    );
}
