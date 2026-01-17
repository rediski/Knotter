'use client';

interface TooltipProps {
    label: string;
    children: React.ReactNode;
}

export const Tooltip = ({ label, children }: TooltipProps) => {
    return (
        <div className="relative group">
            {children}

            <span className="absolute top-10 right-1/2 translate-x-1/2 px-2 py-1 text-xs text-foreground bg-depth-1 border border-depth-3 rounded opacity-0 shadow group-hover:opacity-100 transition-opacity whitespace-nowrap select-none">
                {label}
            </span>
        </div>
    );
};
