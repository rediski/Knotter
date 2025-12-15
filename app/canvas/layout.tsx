import { ReactNode } from 'react';

export const metadata = {
    title: 'Knotter',
    description:
        'Knotter — это нодовый редактор для работы с данными, распространяемый под лицензией GPL-3.0, которая гарантирует, что любые производные работы и модификации останутся столь же свободными и открытыми.',
};

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex overflow-hidden" translate="no">
            {children}
        </div>
    );
}
