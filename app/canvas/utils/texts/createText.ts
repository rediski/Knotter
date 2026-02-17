import type { Text, Position } from '@/canvas/_core/_/canvas.types';
import { v4 as uuidv4 } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getTexts } from '@/canvas/utils/texts/getTexts';
import { resolvePosition } from '@/canvas/utils/items/resolvePosition';
import { canAddItem } from '@/canvas/utils/items/canAddItem';
import { generateUniqueName } from '@/canvas/utils/items/generateUniqueName';

export function createText(content = ''): Text | null {
    if (!canAddItem()) return null;

    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    const texts = getTexts(items);
    const position: Position = resolvePosition();

    const x = position.x ?? 0;
    const y = position.y ?? 0;

    const baseName = 'Текст';
    const existingNames = texts.map((text) => text.name);
    const name = generateUniqueName(baseName, existingNames);

    const text: Text = {
        id: uuidv4(),
        name,
        content: content || 'Текст',
        width: 40,
        height: 40,
        position: { x, y },
        fontSize: 14,
        textAlign: 'left',
        isEditing: false,
        kind: 'text',
    };

    setItems([...items, text]);
    setSelectedItemIds([text.id]);

    return text;
}
