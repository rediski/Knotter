import type { CanvasState, Node, Position } from '@/canvas/canvas.types';

export type CreateItemParams =
    | {
          type: 'node';
          state: Pick<CanvasState, 'nodes'>;
          position: Position;
      }
    | {
          type: 'edge';
          state: Pick<CanvasState, 'nodes' | 'edges'>;
          fromNode: Node;
          toNode: Node;
      }
    | {
          type: 'text';
          state: Pick<CanvasState, 'texts'>;
          content: string;
          position: Position;
      };
