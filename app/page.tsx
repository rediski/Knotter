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
                <div className="flex flex-col items-center mt-24 gap-8 container m-auto">
                    <div className="flex flex-col items-center justify-start max-w-2xl text-center">
                        <div className="w-full text-6xl font-bold mt-2">The open source workspace for graphs</div>
                    </div>

                    <div className="bg-linear-to-br from-bg-accent to-bg-accent/50 w-fit rounded-lg">
                        <div className="relative flex bg-background m-8 p-16 rounded-2xl">
                            <div
                                className="
                                    absolute inset-0 rounded-2xl 
                                    bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] 
                                    bg-size-[128px_128px]
                                "
                            />

                            <Diamond size={128} className="fill-background z-10" />

                            <Square size={128} className="fill-background z-10 ml-32" />

                            <Circle size={128} className="fill-background z-10 ml-32" />

                            <Triangle size={128} className="fill-background z-10 ml-32" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
