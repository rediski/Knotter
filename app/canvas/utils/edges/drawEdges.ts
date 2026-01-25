import { Node, Edge } from '@/canvas/_core/_/canvas.types';

export function drawEdges(ctx: CanvasRenderingContext2D, nodes: Node[], selectedItemIds: string[] = [], edges: Edge[]) {
    ctx.lineWidth = 2;

    const styles = getComputedStyle(document.documentElement);
    const edgeColor = styles.getPropertyValue('--contrast').trim();
    const selectedColor = styles.getPropertyValue('--background-accent').trim();

    for (const edge of edges) {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) continue;

        const fromX = fromNode.position.x;
        const fromY = fromNode.position.y;
        const toX = toNode.position.x;
        const toY = toNode.position.y;

        const isSelected = selectedItemIds.includes(edge.id);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = isSelected ? selectedColor : edgeColor;
        ctx.stroke();
    }
}
