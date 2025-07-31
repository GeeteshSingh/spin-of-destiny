// src/components/GameWrapper.js - Updated Client Wrapper for Complete Game
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the complete game with no SSR
const CompleteGameScreen = dynamic(() => import('./CompleteGameScreen'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4 animate-spin">🎮</div>
                <div className="text-white text-xl">Loading Spin of Destiny...</div>
                <div className="text-gray-400 text-sm mt-2">Preparing the wheels of fate...</div>
            </div>
        </div>
    )
});

export default function GameWrapper() {
    const [isClient, setIsClient] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Check if scripts are loaded
        const checkScripts = () => {
            if (typeof window !== 'undefined' &&
                window.TweenMax &&
                window.Winwheel) {
                setScriptsLoaded(true);
            } else {
                // Retry after 100ms
                setTimeout(checkScripts, 100);
            }
        };

        checkScripts();
    }, []);

    if (!isClient || !scriptsLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⚡</div>
                    <div className="text-white text-xl mb-2">Initializing Game Engine...</div>
                    <div className="text-gray-400 text-sm">Loading Winwheel.js and TweenMax...</div>
                    <div className="mt-4">
                        <div className="w-64 bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!gameStarted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                {/* Title Screen */}
                <div className="text-center mb-12">
                    <div className="text-8xl mb-6 animate-bounce">🎯</div>
                    <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
                        Spin of Destiny
                    </h1>
                    <h2 className="text-3xl text-white mb-2">
                        Character Creator
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Forge your legend through 8 mystical spins! Create heroes, villains, and anti-heroes with unique traits,
                        powers, and rare pet companions. Will you reach the leaderboard's summit?
                    </p>

                    {/* Game Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                        <div className="bg-black bg-opacity-30 rounded-lg p-6">
                            <div className="text-4xl mb-2">🎲</div>
                            <div className="text-white font-semibold mb-1">8 Unique Spins</div>
                            <div className="text-gray-400 text-sm">Character class, powers, weaknesses & more</div>
                        </div>
                        <div className="bg-black bg-opacity-30 rounded-lg p-6">
                            <div className="text-4xl mb-2">🐉</div>
                            <div className="text-white font-semibold mb-1">Rare Pet Bonus</div>
                            <div className="text-gray-400 text-sm">10% chance for powerful companions</div>
                        </div>
                        <div className="bg-black bg-opacity-30 rounded-lg p-6">
                            <div className="text-4xl mb-2">🏆</div>
                            <div className="text-white font-semibold mb-1">4 Leaderboards</div>
                            <div className="text-gray-400 text-sm">Heroes, Villains, Anti-Heroes & Overall</div>
                        </div>
                        <div className="bg-black bg-opacity-30 rounded-lg p-6">
                            <div className="text-4xl mb-2">⚡</div>
                            <div className="text-white font-semibold mb-1">Power Tiers</div>
                            <div className="text-gray-400 text-sm">From Beginner to Cosmic God level</div>
                        </div>
                    </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={() => setGameStarted(true)}
                    className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-2xl transform hover:scale-110 animate-pulse"
                >
                    🎮 Begin Your Destiny
                </button>

                {/* Instructions */}
                <div className="mt-8 text-center text-gray-400 text-sm max-w-md">
                    <p>Click the button above to start your character creation journey.
                        Each spin will determine a different aspect of your character's identity and power level.</p>
                </div>
            </div>
        );
    }

    return <CompleteGameScreen />;
}