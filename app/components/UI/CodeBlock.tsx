'use client';

type Primitive = string | number | boolean | null | undefined;
type AnyObject = { [key: string]: any } | any[] | Primitive;

interface JsonNodeProps {
    value: AnyObject;
    depth?: number;
}

function isObject(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function JsonNode({ value, depth = 0 }: JsonNodeProps) {
    const indentSize = 4;
    const indent = { paddingLeft: depth * indentSize + 'ch' };

    if (typeof value === 'string') return <span className="text-json-string">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-json-number">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-json-boolean">{String(value)}</span>;

    if (value === null) return <span className="text-json-null">null</span>;

    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-json-brackets">{'[]'}</span>;

        return (
            <div>
                <span className="text-json-brackets">[</span>

                {value.map((item, i) => (
                    <div key={i} style={{ paddingLeft: (depth + 1) * indentSize + 'ch' }}>
                        <JsonNode value={item} depth={depth + 1} />

                        {i < value.length - 1 && <span>,</span>}
                    </div>
                ))}

                <div style={indent}>
                    <span className="text-json-brackets">]</span>
                </div>
            </div>
        );
    }

    if (isObject(value)) {
        const entries = Object.entries(value);

        if (entries.length === 0) return <span className="text-json-brackets">{'{}'}</span>;

        return (
            <div>
                <span className="text-json-brackets">{'{'}</span>

                {entries.map(([key, val], idx) => (
                    <div key={key} style={{ paddingLeft: (depth + 1) * indentSize + 'ch' }}>
                        <span className="text-json-key">"{key}"</span>: <JsonNode value={val} depth={depth + 1} />
                        {idx < entries.length - 1 && <span>,</span>}
                    </div>
                ))}

                <div style={indent}>
                    <span className="text-json-brackets">{'}'}</span>
                </div>
            </div>
        );
    }

    return <span className="text-gr">unknown</span>;
}

interface CodeBlockProps<T = AnyObject> {
    data: T | null | undefined;
}

export function CodeBlock<T = AnyObject>({ data }: CodeBlockProps<T>) {
    if (!data) return <span className="text-json-null">Нет данных</span>;

    return (
        <div className="font-mono text-sm leading-5 select-text">
            <JsonNode value={data} />
        </div>
    );
}
