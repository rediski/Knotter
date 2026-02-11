'use client';

type Primitive = string | number | boolean | null | undefined;
type AnyObject = { [key: string]: any } | any[] | Primitive;

interface JsonNodeProps {
    value: AnyObject;
}

function isObject(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function JsonNode({ value }: JsonNodeProps) {
    const indentSize = 4;

    if (typeof value === 'string') return <span className="text-json-string">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-json-number">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-json-boolean">{String(value)}</span>;

    if (value === null) return <span className="text-json-null">null</span>;

    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-json-brackets">[]</span>;

        return (
            <>
                <span className="text-json-brackets">[</span>

                {value.map((item, i) => (
                    <div key={i} style={{ paddingLeft: indentSize + 'ch' }}>
                        <JsonNode value={item} />

                        {i < value.length - 1 && <span>,</span>}
                    </div>
                ))}

                <span className="text-json-brackets">]</span>
            </>
        );
    }

    if (isObject(value)) {
        const entries = Object.entries(value);

        if (entries.length === 0) return <span className="text-json-brackets">{'{}'}</span>;

        return (
            <>
                <span className="text-json-brackets">{'{'}</span>

                {entries.map(([key, value], idx) => (
                    <div key={key} style={{ paddingLeft: indentSize + 'ch' }}>
                        <span className="text-json-key">"{key}"</span>: <JsonNode value={value} />
                        {idx < entries.length - 1 && <span>,</span>}
                    </div>
                ))}

                <span className="text-json-brackets">{'}'}</span>
            </>
        );
    }

    return <span className="text-gray">unknown</span>;
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
