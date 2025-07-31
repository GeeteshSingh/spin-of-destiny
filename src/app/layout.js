// src/app/layout.js

"use client"
import '../app/globals.css';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import Script from 'next/script'; // For loading external scripts
import { initialGameState, loadLeaderboard, saveLeaderboard, audioConfig } from '@/lib/gameLogic';

// Create a context for global game state
const GameStateContext = createContext();

export function useGameState() {
    return useContext(GameStateContext);
}

export default function RootLayout({ children }) {
    const [gameState, setGameState] = useState(initialGameState);
    const audioContextRef = useRef(null);
    const audioBuffersRef = useRef({});

    // Initialize audio context and load sounds
    useEffect(() => {
        const initAudio = async () => {
            // Ensure we are in a browser environment
            if (typeof window !== 'undefined' && !audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            const loadSound = async (name, url) => {
                if (!audioContextRef.current || audioBuffersRef.current[name]) return;
                try {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                    audioBuffersRef.current[name] = audioBuffer;
                } catch (error) {
                    console.error(`Error loading sound ${name} from ${url}:`, error);
                }
            };

            // Load all sounds defined in audioConfig
            for (const key in audioConfig) {
                await loadSound(key, audioConfig[key]);
            }
        };

        initAudio();
    }, []); // Run once on mount

    // Load leaderboard on initial mount
    useEffect(() => {
        setGameState(prevState => ({
            ...prevState,
            leaderboard: loadLeaderboard()
        }));
    }, []);

    const playSound = (name, volume = 1) => {
        if (typeof window === 'undefined' || !gameState.soundEnabled || !audioBuffersRef.current[name] || !audioContextRef.current) return;

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(err => console.warn('Audio resume failed on playSound:', err));
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffersRef.current[name];
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        source.start(0);
    };

    const toggleSound = () => {
        setGameState(prevState => {
            const newSoundEnabled = !prevState.soundEnabled;
            if (newSoundEnabled && audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume().catch(err => console.warn('Audio resume failed:', err));
            }
            if (newSoundEnabled) {
                // Play a small sound if enabling
                setTimeout(() => playSound('select', 0.3), 100);
            }
            return { ...prevState, soundEnabled: newSoundEnabled };
        });
    };

    const updateLeaderboard = (newLeaderboard) => {
        setGameState(prevState => {
            const updatedState = { ...prevState, leaderboard: newLeaderboard };
            saveLeaderboard(newLeaderboard); // Persist to localStorage
            return updatedState;
        });
    };

    // The value provided to the context
    const contextValue = {
        gameState,
        setGameState,
        playSound,
        toggleSound,
        updateLeaderboard
    };

    return (
        <html lang="en">
        {/* Head content here (e.g., meta tags, font links) */}
        <head>
            <title>Spin of Destiny - Character Generator</title>
            <meta name="description" content="Create your ultimate character through the power of chance" />
            <link rel="icon" href="/favicon.ico" />
            {/* Lato font */}
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans text-gray-800 bg-cream-50 min-h-screen flex flex-col">
        {/* Load Winwheel.min.js globally. Make sure it's in your public folder */}
        <Script src="/Winwheel.min.js" strategy="beforeInteractive" />

        <GameStateContext.Provider value={contextValue}>
            <div className="flex-grow flex flex-col"> {/* Main content wrapper */}
                {children} {/* This renders your page.js content */}
            </div>
            {/* Sound Toggle Button (global, outside specific screens) */}
            <button
                id="sound-toggle"
                onClick={toggleSound}
                className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 z-50"
            >
                {gameState.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
        </GameStateContext.Provider>
        </body>
        </html>
    );
}