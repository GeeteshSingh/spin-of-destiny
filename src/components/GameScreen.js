// src/components/GameScreen.js
"use client";

import { useRef, useEffect, useState } from 'react';
import { gameData } from '../lib/gameData';
import { wheelOptions } from '../lib/winwheelConfig';
import { getCommentary } from '../lib/gameLogic';
import { useGameState } from '../app/layout'; // Import useGameState to update global state

// Make sure Winwheel is available globally (from script in layout.js)
const Winwheel = typeof window !== 'undefined' ? window.Winwheel : null;

export default function GameScreen({
                                       character,
                                       spinCount,
                                       maxSpins,
                                       commentaryText,
                                       spinCategoryTitle,
                                       spinSubtitle,
                                       onSpinUpdate, // Use this to update global game state (character, spinCount, commentary)
                                       onGameEnd,    // Callback to trigger transition to results screen
                                       playSound,    // Passed from layout
                                   }) {
    const canvasRef = useRef(null);
    const [currentWheel, setCurrentWheel] = useState(null); // Local state for the wheel instance
    const [isSpinning, setIsSpinning] = useState(false);

    // Categories in the order they will be spun
    const categoriesToSpin = Object.keys(gameData.categories);

    // Function to initialize/re-initialize the wheel
    const setupWheel = () => {
        if (!Winwheel || !canvasRef.current) {
            console.warn("Winwheel library or canvas not available.");
            return;
        }

        const currentCategoryKey = categoriesToSpin[spinCount];
        const currentCategory = gameData.categories[currentCategoryKey];

        if (!currentCategory) {
            // This means all spins are done or an error occurred
            onGameEnd(character); // Trigger game end
            return;
        }

        // Set dynamic text and subtitle based on current category
        onSpinUpdate(prev => ({
            ...prev,
            spinCategoryTitle: `Spinning for: ${currentCategory.name}`,
            spinSubtitle: `What kind of ${currentCategory.name.toLowerCase()} will you be?`,
            commentaryText: getCommentary('spinStart') // Initial commentary for this spin
        }));

        const segments = [
            ...currentCategory.strong.map(name => ({ text: name, type: 'strong' })),
            ...currentCategory.weak.map(name => ({ text: name, type: 'weak' })),
        ];

        // Shuffle segments for randomness
        segments.sort(() => Math.random() - 0.5);

        const newWheelOptions = {
            ...wheelOptions,
            numSegments: segments.length,
            segments: segments.map(s => ({
                textFillStyle: '#ffffff',
                fillStyle: s.type === 'strong' ? '#32B8C6' : '#DC2626', // Use Tailwind colors in hex
                text: s.text,
                type: s.type // Custom property to store strength
            })),
            callbackFinished: (indicatedSegment) => {
                setIsSpinning(false);
                playSound('select', 0.3); // Sound for prize reveal

                const categoryKey = categoriesToSpin[spinCount];
                const newTrait = { name: indicatedSegment.text, type: indicatedSegment.type };

                onSpinUpdate(prev => {
                    const updatedCharacter = {
                        ...prev.character,
                        [categoryKey]: newTrait,
                    };
                    const newSpinCount = prev.spinCount + 1;

                    // If this is the last spin, calculate final balance and trigger game end via callback
                    if (newSpinCount === maxSpins) {
                        onGameEnd(updatedCharacter); // Pass updated character to parent for final calculations
                    }

                    return {
                        ...prev,
                        character: updatedCharacter,
                        spinCount: newSpinCount,
                        commentaryText: getCommentary('spinEnd', indicatedSegment.type),
                    };
                });
            },
        };

        // Ensure previous wheel is cleared/destroyed before creating a new one
        if (currentWheel) {
            currentWheel.clearCanvas();
            // Winwheel doesn't have a formal "destroy" method, clearing canvas is often enough.
            // For more complex cases, you might re-assign the canvas element itself or its context.
        }

        // Create new wheel instance
        const newWheel = new Winwheel(newWheelOptions, canvasRef.current);
        setCurrentWheel(newWheel);
    };

    useEffect(() => {
        // Only setup wheel if not spinning and if spinCount is within limits
        if (!isSpinning && spinCount < maxSpins) {
            setupWheel();
        }
    }, [spinCount, maxSpins, isSpinning, character]); // Re-run when spinCount changes to prepare for next spin

    const handleSpinClick = () => {
        if (!currentWheel || isSpinning) {
            return;
        }
        setIsSpinning(true);
        playSound('spin', 0.5);
        onSpinUpdate(prev => ({ ...prev, commentaryText: getCommentary('spinStart') }));
        currentWheel.startAnimation();
    };

    const currentTraitsList = Object.entries(character).map(([category, trait]) => {
        return (
            <li key={category} className="text-gray-700">
                {gameData.categories[category]?.name}: <span className="font-semibold">{trait.name}</span>
            </li>
        );
    });

    return (
        <div className="container mx-auto max-w-4xl text-center">
            <div className="spin-content bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal-800 mb-4">{spinCategoryTitle}</h2>
                <p className="spin-subtitle text-lg md:text-xl text-gray-700 mb-8">{spinSubtitle}</p>

                <div className="wheel-container relative w-80 h-80 mx-auto mb-8">
                    <canvas id="wheel-canvas" ref={canvasRef} width="300" height="300" className="w-full h-full"></canvas>
                    <button
                        className="spin-button absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out text-xl"
                        onClick={handleSpinClick}
                        disabled={isSpinning || !currentWheel || spinCount === maxSpins}
                    >
                        {spinCount < maxSpins ? 'SPIN!' : 'FINISH'}
                    </button>
                </div>

                <div className="progress-bar-container w-full bg-gray-200 rounded-full h-4 mb-8">
                    <div className="progress-bar bg-teal-400 h-4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${(spinCount / maxSpins) * 100}%` }}></div>
                </div>

                <div className="trait-display bg-gray-100 p-4 rounded-lg border border-gray-300 text-left mb-8 min-h-[8rem]">
                    <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Current Traits:</h3>
                    <ul id="current-traits-list" className="list-disc list-inside text-gray-700">
                        {currentTraitsList}
                    </ul>
                </div>

                <p className="commentary text-base italic text-gray-600 mt-4">{commentaryText}</p>
            </div>
        </div>
    );
}