import { memo, useRef } from 'react';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { CircleHelp } from 'lucide-react';

interface SavePopupProps {
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
}

export const SavePopup = memo(function SavePopup({ onSave, onDiscard, onCancel }: SavePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    useClickOutside(popupRef, onCancel);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={popupRef} className="flex items-start gap-4 bg-depth-1 p-4 rounded-md shadow max-w-md w-full">
                <CircleHelp size={32} className="text-text-accent" />

                <div className="flex flex-col gap-1 w-full">
                    <h3>Сохранить файл перед закрытием?</h3>

                    <p className="text-gray">canvas.knotter.json</p>

                    <div className="flex items-center justify-between gap-2 mt-3">
                        <button
                            onClick={onSave}
                            className="px-3 py-2 bg-bg-accent text-white rounded-md cursor-pointer hover:bg-bg-accent/90 w-full"
                        >
                            Сохранить
                        </button>

                        <button
                            onClick={onDiscard}
                            className="px-3 py-2 bg-depth-2 hover:bg-depth-3 rounded-md cursor-pointer w-full"
                        >
                            Не сохранять
                        </button>

                        <button
                            onClick={onCancel}
                            className="px-3 py-2 bg-depth-2 hover:bg-depth-3 rounded-md cursor-pointer w-full"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});
