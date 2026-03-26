import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Diamond, Square, Circle, Triangle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Knotter',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

const Card = ({ title, text }: { title: string; text: string }) => {
    return (
        <div className="bg-depth-1 border border-depth-3 rounded-lg p-6">
            <h3>{title}</h3>

            <p className="mt-2 text-text-accent text-sm leading-6 font-bold">{text}</p>
        </div>
    );
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

                    <div className="bg-linear-to-br from-bg-accent to-bg-accent/50 w-full rounded-2xl">
                        <div className="relative flex justify-center bg-background m-8 p-16 rounded-lg">
                            <div
                                className="
                                    absolute inset-0 -left-8 rounded-lg
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

                    <div className="flex flex-col gap-4">
                        <div className="flex">
                            <h2 className="text-3xl font-bold">Features</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            <Card
                                title="Clipboard"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />

                            <Card
                                title="Details"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />

                            <Card
                                title="Hierarchy"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />

                            <Card
                                title="History"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />

                            <Card
                                title="Inspector"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />

                            <Card
                                title="Parameters"
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cupidatat sunt commodo aliqua irure
                                ipsum fugiat eiusmod adipiscing."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
