import { useState, useRef, useCallback, useMemo } from 'react';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';
import { useCanvasFileActions } from '@/canvas/components/CanvasControls/useCanvasFileActions';

export function useCanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const { handleOpen, handleSaveAs } = useCanvasFileActions();

    useClickOutside(
        menuRef,
        useCallback(() => setOpen(false), []),
    );

    const toggleMenu = useCallback(() => setOpen((p) => !p), []);

    const handleOpenWithSaveCheck = useCallback(() => {
        setShowSavePopup(true);
        setPendingAction(() => handleOpen);
        setOpen(false);
    }, [handleOpen]);

    const handleSaveAsDirect = useCallback(() => {
        handleSaveAs();
        setOpen(false);
    }, [handleSaveAs]);

    const handleSaveAndProceed = useCallback(async () => {
        setShowSavePopup(false);
        await handleSaveAs();
        if (pendingAction) {
            pendingAction();
        }
        setPendingAction(null);
    }, [handleSaveAs, pendingAction]);

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

    const fileActions = useMemo(
        () => ({
            handleOpen: handleOpenWithSaveCheck,
            handleSaveAs: handleSaveAsDirect,
        }),
        [handleOpenWithSaveCheck, handleSaveAsDirect],
    );

    return {
        open,
        showSavePopup,
        menuRef,
        onOpenProject: fileActions.handleOpen,
        onSaveAs: fileActions.handleSaveAs,
        handleSaveAndProceed,
        handleDiscardAndProceed,
        handleCancel,
        toggleMenu,
        setOpen,
    };
}
