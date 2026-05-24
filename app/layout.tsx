import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/ThemeProvider';
import '@/globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '400', '700'] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning translate="no">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const saved = localStorage.getItem('theme') || 'system';
                                const root = document.documentElement;
                                let theme = saved;
                                if (saved === 'system') {
                                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                }
                                root.setAttribute('data-theme', theme);
                            })();
                        `,
                    }}
                />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
