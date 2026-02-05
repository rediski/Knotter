'use client';

import { useState, useRef, useCallback } from 'react';
import type { Text } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getTexts } from '@/canvas/utils/texts/getTexts';
import { getScreenCoords } from '@/canvas/utils/canvas/getScreenCoords';

type Direction = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type TextResizeRef = {
    targetId: string;
    handleDirection: Direction;
    aspectRatio: number;
    initialMousePos: { x: number; y: number };
    initialElementState: {
        fontSize: number;
        width: number;
        height: number;
        x: number;
        y: number;
    };
};

export function Text({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);

    const texts = getTexts(items);
    const [editingId, setEditingId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLDivElement | null>(null);
    const resizingRef = useRef<TextResizeRef | null>(null);

    const enterEditMode = useCallback(
        (text: Text) => {
            setEditingId(text.id);
            setItems(
                items.map((item) => (item.kind === 'text' && item.id === text.id ? { ...item, isEditing: true } : item)),
            );
        },
        [items, setItems],
    );

    const exitEditMode = useCallback(() => {
        if (!textareaRef.current || !editingId) return;

        const textContent = textareaRef.current.innerText;
        setItems(
            items.map((item) =>
                item.kind === 'text' && item.id === editingId ? { ...item, content: textContent, isEditing: false } : item,
            ),
        );

        setEditingId(null);
    }, [editingId, items, setItems]);

    const beginTextResize = useCallback(
        (text: Text, e: React.MouseEvent, direction: Direction) => {
            e.stopPropagation();
            e.preventDefault();

            const aspectRatio = text.width / text.height;

            resizingRef.current = {
                targetId: text.id,
                handleDirection: direction,
                aspectRatio,
                initialMousePos: { x: e.clientX, y: e.clientY },
                initialElementState: {
                    fontSize: text.fontSize,
                    width: text.width,
                    height: text.height,
                    x: text.position.x,
                    y: text.position.y,
                },
            };

            const handleMove = (ev: MouseEvent) => {
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
                    items.map((item) =>
                        item.kind === 'text' && item.id === resizingRef.current!.targetId
                            ? {
                                  ...item,
                                  width: newWidth,
                                  height: newHeight,
                                  fontSize: newFontSize,
                                  position: { x: newX, y: newY },
                              }
                            : item,
                    ),
                );
            };

            const handleUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', handleUp);
            };

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
        },
        [items, setItems, zoomLevel],
    );

    return (
        <div className="relative inset-0 pointer-events-none">
            {texts.map((text) => {
                const { x: screenX, y: screenY } = getScreenCoords(text.position.x, text.position.y, containerRef);

                const isEditing = editingId === text.id;
                const isSelected = selectedItemIds.includes(text.id);

                return (
                    <div
                        key={text.id}
                        className="absolute pointer-events-auto select-none"
                        data-text-id={text.id}
                        style={{ left: screenX, top: screenY }}
                        onDoubleClick={() => enterEditMode(text)}
                    >
                        <div
                            ref={isEditing ? textareaRef : null}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={exitEditMode}
                            className={`border cursor-move
                                ${
                                    isSelected
                                        ? 'border-bg-accent'
                                        : text.content.length <= 1
                                          ? 'border-2 border-dashed border-bg-accent'
                                          : 'border-transparent'
                                }
                                ${isEditing ? 'border-bg-accent outline-1 outline-bg-accent cursor-text' : ''}
                            `}
                            style={{
                                minWidth: text.width * zoomLevel,
                                padding: `${2 * zoomLevel}px ${6 * zoomLevel}px`,
                                fontSize: text.fontSize * zoomLevel,
                                textAlign: text.textAlign ?? 'left',
                                whiteSpace: 'pre',
                            }}
                        >
                            {text.content}

                            {isSelected && !isEditing && (
                                <ResizeHandle
                                    onResizeStart={(e, dir) => beginTextResize(text, e, dir as Direction)}
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
    onResizeStart: (e: React.MouseEvent, direction: Direction) => void;
    zoomLevel: number;
}) {
    const size = 6 * zoomLevel;
    const half = size / 2;

    const handles: { key: Direction; top?: number; left?: number; right?: number; bottom?: number; cursor: string }[] = [
        { key: 'top-left', top: -half, left: -half, cursor: 'nwse-resize' },
        { key: 'top-right', top: -half, right: -half, cursor: 'nesw-resize' },
        { key: 'bottom-left', bottom: -half, left: -half, cursor: 'nesw-resize' },
        { key: 'bottom-right', bottom: -half, right: -half, cursor: 'nwse-resize' },
    ];

    return (
        <>
            {handles.map((handle) => (
                <div
                    key={handle.key}
                    onMouseDown={(e) => onResizeStart(e, handle.key)}
                    className="absolute bg-depth-1 border border-bg-accent rounded-xs"
                    style={{
                        width: size,
                        height: size,
                        top: handle.top,
                        left: handle.left,
                        right: handle.right,
                        bottom: handle.bottom,
                        cursor: handle.cursor,
                    }}
                />
            ))}
        </>
    );
}
