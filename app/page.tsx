import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { CodeBlock } from '@/components/UI/CodeBlock';
import { panelIcons, type PanelType } from '@/canvas/_core/_/sidebarPanel';

import { Diamond } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Knotter',
    description:
        'Knotter - это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

const Card = ({ title, text }: { title: PanelType; text: string }) => {
    const Icon = panelIcons[title];

    return (
        <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-lg p-6">
            <div className="flex items-center gap-2">
                <Icon size={18} className="text-text-accent" />
                <h3 className="capitalize">{title}</h3>
            </div>

            <p className="text-gray text-sm leading-6">{text}</p>
        </div>
    );
};

export default function Home() {
    return (
        <div className="p-4 min-h-screen">
            <Header />

            <div className="flex flex-col items-center my-24 max-lg:my-12 gap-12 max-lg:gap-6 container m-auto max-w-5xl">
                <div className="flex flex-col items-center justify-start text-center">
                    <div className="w-full text-[clamp(2rem,7vw,4rem)] leading-[1.2em] font-bold mt-2">
                        The open source <br /> workspace for graphs
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex max-lg:flex-col gap-4">
                        <div
                            className="relative bg-depth-1 w-full min-h-64.5 h-full rounded-lg border border-depth-3 overflow-hidden"
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

                        <div className="bg-depth-1 border border-depth-3 rounded-md w-full">
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
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 w-full">
                        <Card
                            title="clipboard"
                            text="Глубокое клонирование узлов, сохраняющее связи, параметры и свойства."
                        />

                        <Card
                            title="details"
                            text="Удобный доступ к данным выбранного элемента с функциями сохранения и копирования."
                        />

                        <Card
                            title="hierarchy"
                            text="Список перетаскиваемых элементов, определяющий порядок отображения на холсте."
                        />

                        <Card
                            title="history"
                            text="Список совершённых действий с возможностью восстановления и перезаписи состояния холста."
                        />

                        <Card title="inspector" text="Перечень доступных и редактируемых свойств выбранного элемента." />

                        <Card title="parameters" text="Гибкая система параметров, поддерживающая примитивы и структуры." />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
