'use client';

import Canvas from '@/canvas/_core/Canvas';

import { MobileFallback } from '@/canvas/components/canvas/MobileFallback';
import { useMobileDetection } from '@/hooks/useMobileDetection';

export default function HomePage() {
    const isMobile = useMobileDetection();

    if (isMobile !== false) {
        return <MobileFallback isMobile={isMobile} />;
    }

    return <Canvas />;
}
