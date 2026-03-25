'use client';

import Link from 'next/link';
import GithubBager from '@/components/GithubBager';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="sticky top-4 mt-4 w-full border-depth-3 bg-background z-50">
            <div className="container flex justify-between items-center bg-depth-1 border border-depth-3 px-6 py-1 rounded-md mx-auto">
                <div className="flex items-center">
                    <Link href="/" className="tracking-wide font-extrabold text-base select-none uppercase">
                        Knotter
                    </Link>
                </div>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <GithubBager />

                    <Link
                        href="/canvas"
                        className="flex items-center w-fit text-sm px-3 h-8 bg-bg-accent/10 hover:bg-bg-accent/15 border border-bg-accent/15 hover:border-bg-accent/20 transition-colors text-text-accent rounded-lg select-none"
                    >
                        Open Workspace
                    </Link>
                </div>
            </div>
        </header>
    );
}
