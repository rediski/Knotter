import { useState, useRef, useCallback } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';

export function useCanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(
        menuRef,
        useCallback(() => setOpen(false), []),
    );

    const toggleMenu = useCallback(() => setOpen((p) => !p), []);

    const handleDiscardAndProceed = useCallback(() => {
        setShowSavePopup(false);
        if (pendingAction) {
            pendingAction();
        }
        setPendingAction(null);
    }, [pendingAction]);

    const handleCancel = useCallback(() => {
        setShowSavePopup(false);
        setPendingAction(null);
    }, []);

    return {
        open,
        showSavePopup,
        menuRef,

        handleDiscardAndProceed,
        handleCancel,
        toggleMenu,
        setOpen,
    };
}
