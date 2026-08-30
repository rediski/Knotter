'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { createScene } from '@/utils/scene/createScene';
import { useItemsStore } from '@/store/useItemsStore';

export default function Header() {
    const router = useRouter();
    const scenes = useItemsStore((state) => state.scenes);

    const openWorkspace = async () => {
        const sceneIds = Object.keys(scenes);

        if (sceneIds.length === 0) {
            const sceneId = await createScene();

            if (sceneId) {
                router.push(`/${sceneId}`);
            }

            return;
        }

        const firstSceneId = sceneIds[0];
        router.push(`/${firstSceneId}`);
    };

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

                    <button
                        onClick={openWorkspace}
                        className="flex items-center w-fit text-sm px-3 h-8 bg-bg-accent border border-border-accent transition-colors text-text-accent rounded-lg select-none cursor-pointer"
                    >
                        Open Workspace
                    </button>
                </div>
            </div>

            <div className="fixed top-0 left-0 w-full h-14.5 bg-linear-to-b from-depth-1 to-transparent backdrop-blur-xs -z-1" />
        </header>
    );
}
