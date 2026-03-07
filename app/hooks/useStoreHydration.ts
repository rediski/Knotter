import { useState, useEffect } from 'react';

interface PersistStore {
    persist?: {
        hasHydrated: () => boolean;
        onFinishHydration: (callback: () => void) => () => void;
    };
}

export const useStoreHydration = (store: PersistStore): boolean => {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        if (!store.persist) {
            setIsHydrated(true);
            return;
        }

        if (store.persist.hasHydrated()) {
            setIsHydrated(true);
            return;
        }

        const unsubscribe = store.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        return unsubscribe;
    }, [store]);

    return isHydrated;
};
