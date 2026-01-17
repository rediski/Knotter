import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full p-4 flex items-center justify-center gap-1">
            <span>Created by</span>

            <Link href="https://github.com/rediski" target="_blank" className="text-text-accent">
                Denis Dolgopolskiy
            </Link>
        </footer>
    );
}
