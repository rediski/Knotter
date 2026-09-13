'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createScene } from '@/utils/scene/createScene';
import { useItemsStore } from '@/store/useItemsStore';
import { Plus } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

const CHARS = 'KNOTERknoter   ';

const NOISE_SPEED = 110;
const CHAOS_RATIO = 0.025;

const CELL_W = 12;
const CELL_H = 16;

const MAX_COLS = 200;
const MAX_ROWS = 120;

const RING_INNER = 1.25;
const RING_OUTER = 1.75;
const RING_SQUASH = 0.32;
const RING_TILT = -0.22;

const RING_SPIN_SPEED = 0.45;

const ASCII_ART = [
    ' _  __            _   _            ',
    '| |/ /_ __   ___ | |_| |_ ___ _ __ ',
    "| ' /| '_ \\ / _ \\| __| __/ _ \\ '__|",
    '| . \\| | | | (_) | |_| ||  __/ |   ',
    '|_|\\_\\_| |_|\\___/ \\__|\\__\\\___|_|   ',
];

const ART_H = ASCII_ART.length;

const ART_W = Math.max(...ASCII_ART.map((line) => line.length));

const rand = (() => {
    let s = (Date.now() ^ 0x9e3779b9) | 0;

    return () => {
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;

        return (s >>> 0) / 0xffffffff;
    };
})();

const pickChar = () => CHARS[(rand() * CHARS.length) | 0];

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export default function Home() {
    const router = useRouter();

    const scenes = useItemsStore((state) => state.scenes);

    const [size, setSize] = useState({
        w: 0,
        h: 0,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const rafRef = useRef<number | null>(null);

    const noiseBufferRef = useRef<string[]>([]);

    useEffect(() => {
        const update = () => {
            setSize({
                w: window.innerWidth,
                h: window.innerHeight,
            });
        };

        update();

        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('resize', update);
        };
    }, []);

    const cols = useMemo(() => Math.min(MAX_COLS, Math.ceil(size.w / CELL_W) + 2), [size.w]);

    const rows = useMemo(() => Math.min(MAX_ROWS, Math.ceil(size.h / CELL_H) + 2), [size.h]);

    const canvasW = cols * CELL_W;
    const canvasH = rows * CELL_H;

    const fontSize = useMemo(() => Math.min(24, Math.max(12, Math.floor((canvasW * 0.52) / ART_W))), [canvasW]);

    const approxLineH = fontSize * 1.05;
    const artPixelH = ART_H * approxLineH;

    const logoOffsetY = (canvasH - artPixelH) / 2;

    const logoBottomY = logoOffsetY + artPixelH;

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d', {
            alpha: true,
        });

        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;

        canvas.style.width = `${canvasW}px`;
        canvas.style.height = `${canvasH}px`;

        ctx.font = `${fontSize}px ${MONO_FONT}`;

        const sample = ctx.measureText('M');
        const charW = sample.width;

        type FontMetrics = TextMetrics & {
            fontBoundingBoxAscent?: number;
            fontBoundingBoxDescent?: number;
        };

        const m = sample as FontMetrics;

        const ascent = typeof m.fontBoundingBoxAscent === 'number' ? m.fontBoundingBoxAscent : fontSize * 0.8;
        const descent = typeof m.fontBoundingBoxDescent === 'number' ? m.fontBoundingBoxDescent : fontSize * 0.2;

        const lineH = ascent + descent;

        const artPixelW = ART_W * charW;

        const logoOffsetX = (canvasW - artPixelW) / 2;
        const logoOffsetYExact = (canvasH - ART_H * lineH) / 2;

        const centerX = canvasW / 2;
        const centerY = canvasH / 2;

        const maxRadius = Math.min(canvasW, canvasH) / 2;
        const radius = maxRadius / (RING_OUTER + 0.15);

        const ringInner = radius * RING_INNER;
        const ringOuter = radius * RING_OUTER;

        const cosTilt = Math.cos(RING_TILT);
        const sinTilt = Math.sin(RING_TILT);

        const total = rows * cols;

        if (noiseBufferRef.current.length !== total) {
            noiseBufferRef.current = Array.from(
                {
                    length: total,
                },
                () => pickChar(),
            );
        }

        const noiseBuffer = noiseBufferRef.current;

        let last = 0;

        const drawRingCell = (
            px: number,
            py: number,
            x: number,
            y: number,
            ringAngle: number,
            ringDist: number,
            spinPhase: number,
        ) => {
            const beam1 = Math.pow(Math.max(0, Math.cos(ringAngle - spinPhase)), 8);

            const beam2 = Math.pow(Math.max(0, Math.cos(ringAngle - spinPhase + Math.PI)), 8);

            const shine = beam1 + beam2;

            const fadeInner = ringDist - ringInner;
            const fadeOuter = ringOuter - ringDist;
            const fadeWidth = CELL_W;

            const fadeIn = fadeInner < fadeWidth ? fadeInner / fadeWidth : 1;
            const fadeOut = fadeOuter < fadeWidth ? fadeOuter / fadeWidth : 1;

            const edgeFade = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));

            const index = y * cols + x;

            if (rand() < CHAOS_RATIO) {
                noiseBuffer[index] = pickChar();
            }

            const baseAlpha = 0.12;

            const alpha = (baseAlpha + 0.55 * shine) * edgeFade;

            ctx.fillStyle = `rgba(120, 200, 255, ${alpha})`;

            ctx.fillText(noiseBuffer[index], px, py);
        };

        const draw = (time: number) => {
            if (time - last < NOISE_SPEED) {
                rafRef.current = requestAnimationFrame(draw);

                return;
            }

            last = time;

            const spinPhase = (time / 1000) * RING_SPIN_SPEED;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.clearRect(0, 0, canvasW, canvasH);

            ctx.font = `${CELL_H - 2}px ${MONO_FONT}`;

            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';

            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            for (let y = 0; y < rows; y++) {
                const py = y * CELL_H;

                for (let x = 0; x < cols; x++) {
                    const px = x * CELL_W;

                    const cellCenterX = px + CELL_W / 2;
                    const cellCenterY = py + CELL_H / 2;

                    const dx = cellCenterX - centerX;
                    const dy = cellCenterY - centerY;

                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const rx = dx * cosTilt - dy * sinTilt;
                    const ry = dx * sinTilt + dy * cosTilt;

                    const ringDist = Math.sqrt(rx * rx + (ry / RING_SQUASH) * (ry / RING_SQUASH));

                    const inRing = ringDist >= ringInner && ringDist <= ringOuter;

                    if (!inRing) {
                        continue;
                    }

                    if (ry >= 0) {
                        continue;
                    }

                    if (dist <= radius) {
                        continue;
                    }

                    const ringAngle = Math.atan2(ry / RING_SQUASH, rx);

                    drawRingCell(px, py, x, y, ringAngle, ringDist, spinPhase);
                }
            }

            for (let y = 0; y < rows; y++) {
                const py = y * CELL_H;

                for (let x = 0; x < cols; x++) {
                    const px = x * CELL_W;

                    const cellCenterX = px + CELL_W / 2;
                    const cellCenterY = py + CELL_H / 2;

                    const dx = cellCenterX - centerX;
                    const dy = cellCenterY - centerY;

                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > radius) {
                        continue;
                    }

                    const edgeFade = dist > radius - CELL_W ? 1 - (dist - (radius - CELL_W)) / CELL_W : 1;

                    const index = y * cols + x;

                    if (rand() < CHAOS_RATIO) {
                        noiseBuffer[index] = pickChar();
                    }

                    const baseAlpha = 0.14 + rand() * 0.08;

                    const alpha = baseAlpha * Math.max(0, Math.min(1, edgeFade));

                    ctx.fillStyle = `rgba(120, 200, 255, ${alpha})`;

                    ctx.fillText(noiseBuffer[index], px, py);
                }
            }

            for (let y = 0; y < rows; y++) {
                const py = y * CELL_H;

                for (let x = 0; x < cols; x++) {
                    const px = x * CELL_W;

                    const cellCenterX = px + CELL_W / 2;
                    const cellCenterY = py + CELL_H / 2;

                    const dx = cellCenterX - centerX;
                    const dy = cellCenterY - centerY;

                    const rx = dx * cosTilt - dy * sinTilt;
                    const ry = dx * sinTilt + dy * cosTilt;

                    const ringDist = Math.sqrt(rx * rx + (ry / RING_SQUASH) * (ry / RING_SQUASH));

                    const inRing = ringDist >= ringInner && ringDist <= ringOuter;

                    if (!inRing) {
                        continue;
                    }

                    if (ry < 0) {
                        continue;
                    }

                    const ringAngle = Math.atan2(ry / RING_SQUASH, rx);

                    drawRingCell(px, py, x, y, ringAngle, ringDist, spinPhase);
                }
            }

            ctx.font = `${fontSize}px ${MONO_FONT}`;
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ededed';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ASCII_ART.forEach((row, i) => {
                ctx.fillText(row, logoOffsetX, logoOffsetYExact + i * lineH);
            });

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [cols, rows, canvasW, canvasH, fontSize]);

    const openWorkspace = async () => {
        const sceneIds = Object.keys(scenes);

        if (sceneIds.length === 0) {
            const sceneId = await createScene();

            if (sceneId) {
                router.push(`/${sceneId}`);
            }

            return;
        }

        router.push(`/${sceneIds[0]}`);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#151517] flex items-center justify-center">
            <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none"
                style={{
                    width: canvasW,
                    height: canvasH,
                }}
            />

            <div
                className="absolute left-1/2 -translate-x-1/2 flex bg-background p-1 rounded-lg items-center gap-1 z-40 mt-4"
                style={{
                    top: `calc(50% + ${logoBottomY - canvasH / 2 + 16}px)`,
                }}
            >
                <button
                    onClick={openWorkspace}
                    className="flex items-center gap-1 w-fit text-sm px-3 h-8 bg-bg-accent border border-border-accent text-text-accent rounded-md select-none cursor-pointer"
                >
                    <Plus size={16} />
                    Новый проект
                </button>

                <Link
                    href="https://github.com/rediski/Knotter"
                    target="_blank"
                    className="flex items-center gap-1 w-fit text-sm px-3 h-8 bg-depth-1 hover:bg-depth-2 text-foreground rounded-md select-none cursor-pointer"
                >
                    <GithubIcon size={20} />
                    Исходный код на <span className="underline">GitHub</span>
                </Link>
            </div>
        </div>
    );
}
