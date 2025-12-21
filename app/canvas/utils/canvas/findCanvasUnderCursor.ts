export function findCanvasUnderCursor(e: MouseEvent, canvas: HTMLCanvasElement | null): boolean {
    if (!canvas) return false;

    return e.target === canvas;
}
