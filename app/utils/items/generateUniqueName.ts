export function generateUniqueName(baseName: string, existingNames: string[]): string {
    if (!existingNames.includes(baseName)) {
        return baseName;
    }

    const usedNumbers = new Set<number>();

    for (const name of existingNames) {
        const match = name.match(new RegExp(`^${baseName} (\\d+)$`));

        if (match) {
            usedNumbers.add(parseInt(match[1], 10));
        }
    }

    let counter = 1;

    while (usedNumbers.has(counter)) {
        counter++;
    }

    return `${baseName} ${counter}`;
}
