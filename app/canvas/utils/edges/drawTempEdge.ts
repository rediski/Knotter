import { Node, Position } from '@/canvas/_core/_/canvas.types';

function getTempEdgeColor(): string {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--edge-temp')?.trim();
}

export function drawTempEdge(
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    tempEdge: { from: string; toPos: Position } | null,
) {
    if (!tempEdge) return;

    const fromNode = nodes.find((n) => n.id === tempEdge.from);

    if (!fromNode) return;

    ctx.strokeStyle = getTempEdgeColor();
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(fromNode.position.x, fromNode.position.y);
    ctx.lineTo(tempEdge.toPos.x, tempEdge.toPos.y);
    ctx.stroke();
}
