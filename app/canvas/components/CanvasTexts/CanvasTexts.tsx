'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { TextElement } from '@/canvas/canvas.types';
import { getTexts } from '@/canvas/utils/texts/getTexts';

export function CanvasTexts() {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);

    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);

    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const offset = useCanvasStore((state) => state.offset);
    const invertY = useCanvasStore((state) => state.invertY);

    const texts = getTexts(items);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftText, setDraftText] = useState('');

    const startEditing = (textElement: TextElement) => {
        setEditingId(textElement.id);
        setDraftText(textElement.content);
    };

    const finishEditing = (textElement: TextElement) => {
        const updated = texts.map((text) => (text.id === textElement.id ? { ...text, content: draftText } : text));

        setItems([...items.filter((item) => item.kind !== 'text'), ...updated]);

        setEditingId(null);
    };

    return (
        <div className="absolute">
            {texts.map((text) => {
                const baseX = text.position.x * zoomLevel + offset.x;
                const baseY = text.position.y * zoomLevel + offset.y;
                const screenX = baseX;
                const screenY = invertY ? -baseY + window.innerHeight : baseY;

                const isEditing = editingId === text.id || text.isEditing;
                const isSelected = selectedItemIds.includes(text.id);

                return (
                    <div
                        key={text.id}
                        className="absolute"
                        onDoubleClick={() => startEditing(text)}
                        style={{
                            left: screenX,
                            top: screenY,
                            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                            transformOrigin: 'center',
                            textAlign: text.textAlign,
                        }}
                    >
                        {isEditing ? (
                            <textarea
                                autoFocus
                                value={draftText}
                                onChange={(e) => setDraftText(e.target.value)}
                                onBlur={() => finishEditing(text)}
                                className="px-3 py-2"
                            />
                        ) : (
                            <div
                                className={`
                                    border px-3 py-1
                                    ${isSelected && 'border-bg-accent'}
                                `}
                            >
                                {text.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
