'use client';

import { useState, useEffect } from 'react';
import { isMobileDevice } from '@/canvas/utils/canvas/mobileDetection';

export const useMobileDetection = (): boolean | null => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        setIsMobile(isMobileDevice());

        const handleResize = () => {
            setIsMobile(isMobileDevice());
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};
