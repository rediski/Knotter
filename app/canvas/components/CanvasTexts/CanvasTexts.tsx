'use client';

import { useState, useRef, useCallback } from 'react';

import type { TextElement } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

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
        targetId: string;
        handleDirection: string;
        aspectRatio: number;

        initialMousePos: {
            x: number;
            y: number;
        };

        initialElementState: {
            fontSize: number;
            width: number;
            height: number;
            x: number;
            y: number;
        };
    } | null>(null);

    const enterEditMode = useCallback(
        (text: TextElement) => {
            setEditingId(text.id);

            const updatedItems = items.map((item) =>
                item.kind === 'text' && item.id === text.id ? { ...item, isEditing: true } : item,
            );

            setItems(updatedItems);
        },
        [items, setItems],
    );

    const exitEditMode = useCallback(() => {
        if (!textareaRef.current || !editingId) return;

        const textContent = textareaRef.current.innerText;

        const updatedItems = items.map((item) =>
            item.kind === 'text' && item.id === editingId
                ? {
                      ...item,
                      content: textContent,
                      isEditing: false,
                  }
                : item,
        );

        setItems(updatedItems);
        setEditingId(null);
    }, [editingId, items, setItems]);

    const beginTextResize = useCallback(
        (text: TextElement, e: React.MouseEvent, direction: string) => {
            e.stopPropagation();
            e.preventDefault();

            const currentHeight = text.height;

            const aspectRatio = text.width / currentHeight;

            resizingRef.current = {
                targetId: text.id,
                handleDirection: direction,
                aspectRatio,

                initialMousePos: {
                    x: e.clientX,
                    y: e.clientY,
                },

                initialElementState: {
                    fontSize: text.fontSize,
                    width: text.width,
                    height: currentHeight,
                    x: text.position.x,
                    y: text.position.y,
                },
            };

            const handleResizeMove = (ev: MouseEvent) => {
                if (!resizingRef.current) return;

                const { handleDirection, initialMousePos, initialElementState, aspectRatio } = resizingRef.current;

                const dx = (ev.clientX - initialMousePos.x) / zoomLevel;

                let newWidth = initialElementState.width;
                let newHeight = initialElementState.height;
                let newX = initialElementState.x;
                let newY = initialElementState.y;

                switch (handleDirection) {
                    case 'top-left':
                        newWidth = Math.max(initialElementState.width - dx, 10);
                        newHeight = newWidth / aspectRatio;
                        newX = initialElementState.x + (initialElementState.width - newWidth);
                        newY = initialElementState.y + (initialElementState.height - newHeight);
                        break;
                    case 'top-right':
                        newWidth = Math.max(initialElementState.width + dx, 10);
                        newHeight = newWidth / aspectRatio;
                        newY = initialElementState.y + (initialElementState.height - newHeight);
                        break;
                    case 'bottom-left':
                        newWidth = Math.max(initialElementState.width - dx, 10);
                        newHeight = newWidth / aspectRatio;
                        newX = initialElementState.x + (initialElementState.width - newWidth);
                        break;
                    case 'bottom-right':
                        newWidth = Math.max(initialElementState.width + dx, 10);
                        newHeight = newWidth / aspectRatio;
                        break;
                }

                const newFontSize = Math.max(initialElementState.fontSize * (newWidth / initialElementState.width), 6);

                setItems(
                    items.map((item) => {
                        if (item.kind !== 'text' || item.id !== resizingRef.current!.targetId) return item;
                        if (editingId === item.id) return item;

                        return {
                            ...item,
                            width: newWidth,
                            height: newHeight,
                            fontSize: newFontSize,
                            position: {
                                ...item.position,
                                x: newX,
                                y: newY,
                            },
                        };
                    }),
                );
            };

            const handleResizeEnd = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleResizeMove);
                window.removeEventListener('mouseup', handleResizeEnd);
            };

            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);
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
                        onDoubleClick={() => enterEditMode(text)}
                    >
                        <div
                            key={isEditing ? `editing-${text.id}` : text.id}
                            ref={isEditing ? textareaRef : null}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={exitEditMode}
                            className={`border cursor-move
                                ${isSelected ? 'border-bg-accent' : 'border-transparent'}
                                ${isEditing ? 'border-bg-accent outline-1 outline-bg-accent cursor-text' : ''}
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
                                    onResizeStart={(e, direction) => beginTextResize(text, e, direction)}
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
            {handles.map((handle) => (
                <div
                    key={handle.direction}
                    onMouseDown={(e) => onResizeStart(e, handle.direction)}
                    className="absolute bg-depth-1 border border-bg-accent rounded-xs"
                    style={{
                        width: size,
                        height: size,
                        top: handle.top,
                        bottom: handle.bottom,
                        left: handle.left,
                        right: handle.right,
                        cursor: handle.cursor,
                    }}
                />
            ))}
        </>
    );
}
