import Link from 'next/link';

import { GithubIcon } from '@/icons/GithubIcon';
import { DiscordIcon } from '@/icons/DiscordIcon';

export default function Footer() {
    return (
        <footer className="w-full flex items-center justify-between gap-1 container max-w-5xl m-auto border border-depth-3 bg-depth-1 py-1 px-4 rounded-md">
            <div className="flex gap-2 text-text-accent text-sm ">
                <Link href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">
                    License
                </Link>

                <Link href="https://github.com/rediski/Knotter/issues" target="_blank">
                    Issues
                </Link>
            </div>

            <div className="flex items-center gap-2 text-gray">
                <Link href="https://github.com/rediski/Knotter" target="_blank">
                    <GithubIcon size={20} />
                </Link>

                <Link href="https://discord.gg/QhxB5hHe8y" target="_blank">
                    <DiscordIcon size={20} />
                </Link>
            </div>
        </footer>
    );
}
