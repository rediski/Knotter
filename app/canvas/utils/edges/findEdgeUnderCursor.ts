import { Position, Edge, Node } from '@/canvas/_core/_/canvas.types';

const EDGE_HIT_RADIUS = 5;

function calculateDistance(pointA: Position, pointB: Position): number {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getNearestPointOnEdge(cursor: Position, start: Position, end: Position): Position {
    const deltaX = cursor.x - start.x;
    const deltaY = cursor.y - start.y;
    const edgeX = end.x - start.x;
    const edgeY = end.y - start.y;

    const edgeLengthSquared = edgeX * edgeX + edgeY * edgeY;
    const projection = edgeLengthSquared !== 0 ? (deltaX * edgeX + deltaY * edgeY) / edgeLengthSquared : -1;

    if (projection < 0) return start;
    if (projection > 1) return end;

    return { x: start.x + projection * edgeX, y: start.y + projection * edgeY };
}

export function findEdgeUnderCursor(edges: Edge[], nodes: Node[], cursor: Position): Edge | null {
    for (const edge of edges) {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) continue;

        const nearestPoint = getNearestPointOnEdge(cursor, fromNode.position, toNode.position);

        if (calculateDistance(cursor, nearestPoint) <= EDGE_HIT_RADIUS) {
            return edge;
        }
    }

    return null;
}
