import { memo } from 'react';
import { MenuContent } from '@/canvas/components/CanvasControls/CanvasControlsMenuContent';
import { useCanvasControlsMenu } from '@/canvas/components/CanvasControls/useCanvasControlsMenu';

import { Menu } from 'lucide-react';

export const CanvasControlsMenu = memo(function CanvasControlsMenu() {
    const {
        open,

        menuRef,

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
            {open && <MenuContent />}
        </div>
    );
});
