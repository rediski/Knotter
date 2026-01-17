import { memo } from 'react';

import { MenuContent } from '@/canvas/components/CanvasControls/CanvasControlsMenuContent';
import { SavePopup } from '@/canvas/components/CanvasControls/SavePopup';

import { useCanvasControlsMenu } from '@/canvas/hooks/CanvasControls/useCanvasControlsMenu';

import { Menu } from 'lucide-react';

export const CanvasControlsMenu = memo(function CanvasControlsMenu() {
    const {
        open,
        showSavePopup,
        menuRef,
        onOpenProject,
        onSaveAs,
        handleSaveAndProceed,
        handleDiscardAndProceed,
        handleCancel,
        toggleMenu,
    } = useCanvasControlsMenu();

    return (
        <div className="flex flex-col gap-2 max-w-60 w-full" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`
                    p-2 rounded-md w-fit shadow cursor-pointer 
                    ${open ? 'bg-bg-accent text-white' : 'bg-depth-2 hover:bg-border'}
                `}
            >
                <Menu size={16} />
            </button>

            {open && <MenuContent onOpenProject={onOpenProject} onSaveAs={onSaveAs} />}

            {showSavePopup && (
                <SavePopup onSave={handleSaveAndProceed} onDiscard={handleDiscardAndProceed} onCancel={handleCancel} />
            )}
        </div>
    );
});
