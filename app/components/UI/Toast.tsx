'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CircleCheck, CircleAlert, CircleMinus } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; type: ToastType };

type ToastContextType = {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastIcons = {
    success: CircleCheck,
    error: CircleMinus,
    info: CircleAlert,
};

const typeStyles = {
    success: 'text-green',
    error: 'text-red',
    info: 'text-yellow',
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [nextId, setNextId] = useState(1);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = 'info') => {
            const id = nextId;
            setNextId((prev) => prev + 1);

            setToasts((prev) => [...prev, { id, message, type }]);

            setTimeout(() => removeToast(id), 4000);
        },
        [nextId, removeToast],
    );

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}

            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => {
                    const Icon = ToastIcons[toast.type];
                    const className = typeStyles[toast.type];

                    return (
                        <div
                            key={toast.id}
                            className={`
                                flex items-center gap-3 px-4 py-3 bg-depth-2 rounded-md shadow backdrop-blur-sm min-w-xs max-w-sm animate-in slide-in-from-right-10 
                                ${className}
                            `}
                            onClick={() => removeToast(toast.id)}
                        >
                            <Icon size={20} className="flex-shrink-0" />

                            <div className="text-sm font-medium">{toast.message}</div>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) throw new Error('useToast не может использоваться без ToastProvider');

    return context;
}
