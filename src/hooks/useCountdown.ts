import { useState, useEffect } from 'react';

/**
 * Counts down to a target timestamp in real time (updates every second).
 * Returns remaining milliseconds. Returns 0 when expired.
 */
export function useCountdown(targetMs: number): number {
    const [remaining, setRemaining] = useState(() => Math.max(0, targetMs - Date.now()));

    useEffect(() => {
        if (remaining === 0) return;
        const id = setInterval(() => {
            const r = Math.max(0, targetMs - Date.now());
            setRemaining(r);
            if (r === 0) clearInterval(id);
        }, 1000);
        return () => clearInterval(id);
    }, [targetMs]);

    return remaining;
}
