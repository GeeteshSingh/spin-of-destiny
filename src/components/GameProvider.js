// src/components/GameProvider.js
"use client";

import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { initialGameState, loadLeaderboard, saveLeaderboard, audioConfig } from '@/lib/gameLogic';

const GameStateContext = createContext();

export function useGameState() {
    return useContext(GameStateContext);
}

export default function GameProvider({ children }) {
    const [gameState, setGameState] = useState(initialGameState);
    const audioContextRef = useRef(null);
    const audioBuffersRef = useRef({});

    // Initialize audio context and load sounds
    useEffect(() => {
        const initAudio = async () => {
            if (typeof window !== 'undefined' && !audioContextRef.current) {
                try {
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                } catch (error) {
                    console.log('Audio context not available:', error);
                    return;
                }
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

            for (const key in audioConfig) {
                await loadSound(key, audioConfig[key]);
            }
        };

        initAudio();
    }, []);

    useEffect(() => {
        setGameState(prevState => ({
            ...prevState,
            leaderboard: loadLeaderboard()
        }));
    }, []);

    const playSound = (name, volume = 1) => {
        if (typeof window === 'undefined' || !gameState.soundEnabled || !audioBuffersRef.current[name] || !audioContextRef.current) return;

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(err => console.warn('Audio resume failed:', err));
        }

        try {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffersRef.current[name];
            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            source.start(0);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    };

    const toggleSound = () => {
        setGameState(prevState => {
            const newSoundEnabled = !prevState.soundEnabled;
            if (newSoundEnabled && audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume().catch(err => console.warn('Audio resume failed:', err));
            }

            if (newSoundEnabled) {
                setTimeout(() => playSound('select', 0.3), 100);
            }

            return {
                ...prevState,
                soundEnabled: newSoundEnabled
            };
        });
    };

    const updateLeaderboard = (newLeaderboard) => {
        setGameState(prevState => {
            const updatedState = {
                ...prevState,
                leaderboard: newLeaderboard
            };
            saveLeaderboard(newLeaderboard);
            return updatedState;
        });
    };

    const contextValue = {
        gameState,
        setGameState,
        playSound,
        toggleSound,
        updateLeaderboard
    };

    return (
        <GameStateContext.Provider value={contextValue}>
            {children}
        </GameStateContext.Provider>
    );
}
