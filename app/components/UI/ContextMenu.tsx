'use client';
import React, { forwardRef, memo } from 'react';

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    children: React.ReactNode;
}

export const ContextMenu = memo(
    forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu({ isOpen, position, children }, ref) {
        if (!isOpen) return null;

        return (
            <div
                ref={ref}
                className="min-w-56 fixed bg-depth-2 border border-depth-6 text-foreground rounded shadow py-1 text-sm z-50"
                style={{ top: position.y, left: position.x }}
            >
                {children}
            </div>
        );
    }),
);
