import { TextElement, Position } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export function createText(texts: TextElement[], content: string, position: Position): TextElement {
    const x = position.x ?? 0;
    const y = position.y ?? 0;

    const baseName = 'Текст';
    let name = baseName;

    let counter = 0;

    const existingNames = new Set(texts.map((text) => text.name));

    while (existingNames.has(name)) {
        counter++;
        name = `${baseName} ${counter}`;
    }

    return {
        id: uuidv4(),
        name: name,
        content: content,
        position: { x, y },
        textAlign: 'left',
        isEditing: false,
        kind: 'text',
    };
}
