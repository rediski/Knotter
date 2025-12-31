'use client';

import { useState, useRef, useCallback } from 'react';
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
    const textareaRef = useRef<HTMLDivElement | null>(null);

    const resizingRef = useRef<{
        startX: number;
        startY: number;
        startFontSize: number;
        startWidth: number;
        startXPos: number;
        startYPos: number;
        id: string;
        direction: string;
    } | null>(null);

    const startEditing = useCallback((text: TextElement) => {
        setEditingId(text.id);
        setTimeout(() => {
            if (!textareaRef.current) return;

            const el = textareaRef.current;

            el.focus();

            const range = document.createRange();

            range.selectNodeContents(el);
            range.collapse(false);

            const sel = window.getSelection();

            sel?.removeAllRanges();
            sel?.addRange(range);
        }, 0);
    }, []);

    const finishEditing = useCallback(() => {
        if (!textareaRef.current || !editingId) return;

        const html = textareaRef.current.innerHTML || '';

        const newText = html
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/<br>/g, '\n')
            .replace(/&nbsp;/g, ' ')
            .trim();

        const updatedItems = items.map((item) =>
            item.kind === 'text' && item.id === editingId ? { ...item, content: newText } : item,
        );

        setItems(updatedItems);

        setEditingId(null);
    }, [editingId, items, setItems]);

    const startResize = useCallback(
        (text: TextElement, e: React.MouseEvent, direction: string) => {
            e.stopPropagation();
            e.preventDefault();

            resizingRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                startFontSize: text.fontSize ?? 16,
                startWidth: text.width ?? 100,
                startXPos: text.position.x,
                startYPos: text.position.y,
                id: text.id,
                direction,
            };

            const onMove = (ev: MouseEvent) => {
                if (!resizingRef.current) return;

                const { direction, startX, startY, startWidth, startFontSize } = resizingRef.current;

                const dx = (ev.clientX - startX) / zoomLevel;
                const dy = (ev.clientY - startY) / zoomLevel;

                let newWidth = startWidth;
                let newFontSize = startFontSize;

                switch (direction) {
                    case 'top-left':
                        newWidth = Math.max(startWidth - dx, 10);
                        newFontSize = Math.max(startFontSize - dy, 6);
                        break;
                    case 'top-right':
                        newWidth = Math.max(startWidth + dx, 10);
                        newFontSize = Math.max(startFontSize - dy, 6);
                        break;
                    case 'bottom-left':
                        newWidth = Math.max(startWidth - dx, 10);
                        newFontSize = Math.max(startFontSize + dy, 6);
                        break;
                    case 'bottom-right':
                        newWidth = Math.max(startWidth + dx, 10);
                        newFontSize = Math.max(startFontSize + dy, 6);
                        break;
                }

                setItems(
                    items.map((item) => {
                        if (item.kind !== 'text' || item.id !== resizingRef.current!.id) return item;
                        if (editingId === item.id) return item;
                        return {
                            ...item,
                            width: newWidth,
                            fontSize: newFontSize,
                            position: item.position,
                        };
                    }),
                );
            };

            const onUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        },
        [editingId, items, setItems, zoomLevel],
    );

    return (
        <div className="relative inset-0 pointer-events-none">
            {texts.map((text) => {
                const baseX = text.position.x * zoomLevel + offset.x;
                const baseY = text.position.y * zoomLevel + offset.y;
                const screenX = baseX;
                const screenY = invertY ? -baseY + window.innerHeight : baseY;

                const isEditing = editingId === text.id;
                const isSelected = selectedItemIds.includes(text.id);

                return (
                    <div
                        key={text.id}
                        className="absolute pointer-events-auto select-none"
                        data-text-id={text.id}
                        style={{
                            left: screenX,
                            top: screenY,
                            fontSize: (text.fontSize ?? 16) * zoomLevel,
                            textAlign: text.textAlign ?? 'left',
                            whiteSpace: 'pre',
                        }}
                        onDoubleClick={() => startEditing(text)}
                    >
                        <div
                            key={isEditing ? `editing-${text.id}` : text.id}
                            ref={isEditing ? textareaRef : null}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={finishEditing}
                            className={`relative cursor-text border
                                ${isSelected ? 'border-bg-accent' : 'border-transparent'}
                                ${isEditing ? 'border-bg-accent outline-1 outline-bg-accent' : ''}
                            `}
                            style={{
                                minWidth: (text.width ?? 100) * zoomLevel,
                                padding: `${2 * zoomLevel}px ${6 * zoomLevel}px`,
                                textAlign: text.textAlign ?? 'left',
                                fontSize: (text.fontSize ?? 16) * zoomLevel,
                            }}
                        >
                            {text.content}
                            {isSelected && !isEditing && (
                                <ResizeHandle
                                    onResizeStart={(e, direction) => startResize(text, e, direction)}
                                    zoomLevel={zoomLevel}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ResizeHandle({
    onResizeStart,
    zoomLevel,
}: {
    onResizeStart: (e: React.MouseEvent, direction: string) => void;
    zoomLevel: number;
}) {
    const baseSize = 6;
    const size = baseSize * zoomLevel;
    const half = size / 2;

    const handles = [
        { direction: 'top-left', top: -half, left: -half, cursor: 'nwse-resize' },
        { direction: 'top-right', top: -half, right: -half, cursor: 'nesw-resize' },
        { direction: 'bottom-left', bottom: -half, left: -half, cursor: 'nesw-resize' },
        { direction: 'bottom-right', bottom: -half, right: -half, cursor: 'nwse-resize' },
    ];

    return (
        <>
            {handles.map((h) => (
                <div
                    key={h.direction}
                    onMouseDown={(e) => onResizeStart(e, h.direction)}
                    className="absolute bg-depth-1 border border-bg-accent rounded-xs"
                    style={{
                        width: size,
                        height: size,
                        top: h.top,
                        bottom: h.bottom,
                        left: h.left,
                        right: h.right,
                        cursor: h.cursor,
                    }}
                />
            ))}
        </>
    );
}
