'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { GithubIcon } from '@/components/icons/GithubIcon';

export function GithubBager() {
    const [stars, setStars] = useState(null);

    const username = 'rediski';
    const repo = 'Knotter';

    const FETCH_INTERVAL = 300000;

    useEffect(() => {
        const fetchStars = () => {
            fetch(`https://api.github.com/repos/${username}/${repo}`)
                .then((res) => res.json())
                .then((data) => setStars(data.stargazers_count))
                .catch((err) => console.error('Ошибка при получении данных GitHub:', err));
        };

        fetchStars();

        const interval = setInterval(fetchStars, FETCH_INTERVAL);

        return () => clearInterval(interval);
    }, [username, repo]);

    return (
        <Link
            href={`https://github.com/${username}/${repo}`}
            target="_blank"
            className="flex items-center h-8 gap-2 w-fit bg-depth-2 hover:bg-depth-3 border border-depth-3 rounded-md text-sm px-2"
        >
            <div className="w-5 h-8 flex items-center justify-center">
                <GithubIcon size={24} />
            </div>

            <p>{stars}</p>
        </Link>
    );
}
