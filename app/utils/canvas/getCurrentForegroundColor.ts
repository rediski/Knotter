export function getCurrentForegroundColor(): string {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();

    return color;
}
