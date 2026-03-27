import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Diamond, Square, Circle, Triangle, Hexagon } from 'lucide-react';
import { CodeBlock } from './components/UI/CodeBlock';

export const metadata: Metadata = {
    title: 'Knotter',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

const Card = ({ title, text }: { title: string; text: string }) => {
    return (
        <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-lg p-6">
            <h3>{title}</h3>

            <p className="text-text-accent text-sm leading-5 font-bold">{text}</p>
        </div>
    );
};

export default function Home() {
    return (
        <>
            <Header />

            <div className="px-4">
                <div className="flex flex-col items-center my-24 gap-12 container m-auto max-w-5xl">
                    <div className="flex flex-col items-center justify-start text-center">
                        <div className="w-full text-6xl font-bold mt-2">
                            The open source <br /> workspace for graphs
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex max-lg:flex-col gap-4">
                            <div
                                className="relative bg-depth-1 w-full min-h-63.5 h-full rounded-lg border border-depth-3 overflow-hidden"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                                        linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '64px 64px',
                                    backgroundPosition: 'center center',
                                    backgroundRepeat: 'repeat',
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Diamond
                                        size={64}
                                        className="fill-depth-1 -translate-x-24 -translate-y-8"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </div>

                            <div className="bg-depth-1 p-4 border border-depth-3 rounded-md w-full">
                                <CodeBlock
                                    data={{
                                        name: 'The best node',
                                        kind: 'node',
                                        shapeType: 'diamond',
                                        position: {
                                            x: 0,
                                            y: 0,
                                        },
                                        edges: [],
                                        parameters: [],
                                    }}
                                ></CodeBlock>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 w-full">
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
