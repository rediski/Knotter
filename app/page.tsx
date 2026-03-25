import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Diamond, Square, Circle, Triangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Knotter',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

export default function Home() {
    return (
        <>
            <Header />

            <div className="px-4">
                <div className="flex flex-col items-center my-24 gap-12 container m-auto">
                    <div className="flex flex-col items-center justify-start max-w-2xl text-center">
                        <div className="w-full text-6xl font-bold mt-2">The open source workspace for graphs</div>
                    </div>

                    <div className="bg-linear-to-br from-bg-accent to-bg-accent/50 w-fit rounded-2xl">
                        <div className="relative flex bg-background m-8 p-16 rounded-lg">
                            <div
                                className="
                                    absolute inset-0 rounded-lg
                                    bg-[linear-gradient(to_right,var(--grid-color-1)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color-1)_1px,transparent_1px)] 
                                    bg-size-[128px_128px]
                                "
                            />

                            <div className="flex gap-32 z-10">
                                <Diamond size={128} className="fill-background" />

                                <Square size={128} className="fill-background" />

                                <Circle size={128} className="fill-background" />

                                <Triangle size={128} className="fill-background" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
