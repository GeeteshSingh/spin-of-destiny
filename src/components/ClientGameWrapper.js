'use client';

import { useEffect, useState } from 'react';
import GameScreen from './GameScreen';

export default function ClientGameWrapper() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const checkScripts = () => {
            if (typeof window !== 'undefined' && window.TweenMax && window.Winwheel) {
                setReady(true);
            } else {
                setTimeout(checkScripts, 100);
            }
        };
        checkScripts();
    }, []);

    if (!ready) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Loading game...
            </div>
        );
    }
    return <GameScreen />;
}
