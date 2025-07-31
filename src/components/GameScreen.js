// src/components/GameScreen.js
"use client";

import { useRef, useEffect, useState } from 'react';
import { gameData } from '../lib/gameData';
import { wheelOptions } from '../lib/winwheelConfig';
import { getCommentary, getCategoriesToSpin, isPetRedemptionSpin } from '../lib/gameLogic';

// Make sure Winwheel is available globally
const Winwheel = typeof window !== 'undefined' ? window.Winwheel : null;

export default function GameScreen({
                                       character,
                                       spinCount,
                                       maxSpins,
                                       commentaryText,
                                       spinCategoryTitle,
                                       spinSubtitle,
                                       onSpinUpdate,
                                       onSpinComplete,
                                       playSound,
                                   }) {
    const canvasRef = useRef(null);
    const [currentWheel, setCurrentWheel] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    // Get categories for regular character creation (first 7 spins)
    const categoriesToSpin = getCategoriesToSpin();

    const setupWheel = () => {
        if (!Winwheel || !canvasRef.current) {
            console.warn("Winwheel library or canvas not available.");
            return;
        }

        // Check if this is the pet redemption spin (8th spin)
        if (isPetRedemptionSpin(spinCount)) {
            setupPetRedemptionWheel();
        } else {
            setupRegularCharacterWheel();
        }
    };

    const setupPetRedemptionWheel = () => {
        const petRedemptionCategory = gameData.categories.pet_redemption;

        onSpinUpdate(prev => ({
            ...prev,
            spinCategoryTitle: `Final Spin: ${petRedemptionCategory.name}`,
            spinSubtitle: "Will fate grant you a mystical companion?",
            commentaryText: "The final spin... will you walk alone or find a companion?"
        }));

        const segments = [
            ...petRedemptionCategory.strong.map(name => ({ text: name, type: 'strong' })),
            ...petRedemptionCategory.weak.map(name => ({ text: name, type: 'weak' })),
        ];

        // Shuffle segments for randomness
        segments.sort(() => Math.random() - 0.5);

        const newWheelOptions = {
            ...wheelOptions,
            numSegments: segments.length,
            segments: segments.map(s => ({
                textFillStyle: '#ffffff',
                fillStyle: s.type === 'strong' ? '#10B981' : '#EF4444', // Green for pet available, red for NO
                text: s.text,
                type: s.type
            })),
            callbackFinished: (indicatedSegment) => {
                setIsSpinning(false);
                playSound('select', 0.3);

                // Update commentary based on result
                const commentaryType = indicatedSegment.text === "Pet Bonus Available!" ? 'petAvailable' : 'noPet';
                onSpinUpdate(prev => ({
                    ...prev,
                    commentaryText: getCommentary(commentaryType)
                }));

                // Wait a moment for commentary to display, then proceed
                setTimeout(() => {
                    onSpinComplete(character, indicatedSegment.text);
                }, 2000);
            },
        };

        if (currentWheel) {
            currentWheel.clearCanvas();
        }

        const newWheel = new Winwheel(newWheelOptions, canvasRef.current);
        setCurrentWheel(newWheel);
    };

    const setupRegularCharacterWheel = () => {
        const currentCategoryKey = categoriesToSpin[spinCount];
        const currentCategory = gameData.categories[currentCategoryKey];

        if (!currentCategory) {
            // This shouldn't happen with proper flow, but handle gracefully
            console.error("No category found for spin:", spinCount);
            return;
        }

        onSpinUpdate(prev => ({
            ...prev,
            spinCategoryTitle: `Spinning for: ${currentCategory.name}`,
            spinSubtitle: `What kind of ${currentCategory.name.toLowerCase()} will you be?`,
            commentaryText: getCommentary('spinStart')
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
                fillStyle: s.type === 'strong' ? '#32B8C6' : '#DC2626',
                text: s.text,
                type: s.type
            })),
            callbackFinished: (indicatedSegment) => {
                setIsSpinning(false);
                playSound('select', 0.3);

                const categoryKey = categoriesToSpin[spinCount];
                const newTrait = {
                    name: indicatedSegment.text,
                    type: indicatedSegment.type
                };

                const updatedCharacter = {
                    ...character,
                    [categoryKey]: newTrait,
                };

                onSpinUpdate(prev => ({
                    ...prev,
                    commentaryText: getCommentary('spinEnd', indicatedSegment.type),
                }));

                // Wait a moment for commentary, then proceed to next spin
                setTimeout(() => {
                    onSpinComplete(updatedCharacter);
                }, 1500);
            },
        };

        if (currentWheel) {
            currentWheel.clearCanvas();
        }

        const newWheel = new Winwheel(newWheelOptions, canvasRef.current);
        setCurrentWheel(newWheel);
    };

    useEffect(() => {
        if (!isSpinning && spinCount < maxSpins) {
            setupWheel();
        }
    }, [spinCount, maxSpins, isSpinning, character]);

    const handleSpinClick = () => {
        if (!currentWheel || isSpinning) {
            return;
        }

        setIsSpinning(true);
        playSound('spin', 0.5);

        onSpinUpdate(prev => ({
            ...prev,
            commentaryText: getCommentary('spinStart')
        }));

        currentWheel.startAnimation();
    };

    // Display current character traits
    const currentTraitsList = Object.entries(character).map(([category, trait]) => {
        if (category === 'pet_redemption') return null; // Don't show pet redemption trait

        return (
            <div key={category} className="character-trait">
                <span className="trait-category">{category.replace('_', ' ').toUpperCase()}:</span>
                <span className={`trait-value ${trait.type === 'strong' ? 'strong' : 'weak'}`}>
          {trait.name}
        </span>
            </div>
        );
    }).filter(Boolean);

    // Calculate progress
    const progress = (spinCount / maxSpins) * 100;

    return (
        <div className="game-screen">
            <div className="game-header">
                <h1 className="category-title">{spinCategoryTitle}</h1>
                <div className="progress-indicator">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">
            {spinCount < 7
                ? `Character Creation: ${spinCount}/7`
                : spinCount === 7
                    ? "Final Spin: Pet Redemption"
                    : "Complete"
            }
          </span>
                </div>
            </div>

            <div className="game-content">
                <div className="wheel-container">
                    <div className="wheel-wrapper">
                        <canvas
                            ref={canvasRef}
                            id="wheel-canvas"
                            width="300"
                            height="300"
                            className={isSpinning ? 'spinning' : ''}
                        />
                        <div className={`wheel-pointer ${isSpinning ? 'spinning' : ''}`}></div>
                    </div>

                    {spinCount < maxSpins && (
                        <button
                            className={`spin-button btn btn--primary ${isSpinning ? 'spinning' : ''}`}
                            onClick={handleSpinClick}
                            disabled={isSpinning}
                        >
                            {isSpinning ? 'Spinning...' : isPetRedemptionSpin(spinCount) ? 'Final Spin!' : 'Spin the Wheel!'}
                        </button>
                    )}

                    <p className="spin-instructions">
                        {isPetRedemptionSpin(spinCount)
                            ? "One final spin to determine if fate grants you a companion..."
                            : spinSubtitle
                        }
                    </p>

                    <div className="speech-bubble">
                        <p className="quote-text">{commentaryText}</p>
                        <div className="speech-bubble-arrow"></div>
                    </div>
                </div>

                <div className="character-panel">
                    <h3>Your Character So Far</h3>
                    {currentTraitsList.length > 0 ? (
                        <div className="character-traits">
                            {currentTraitsList}
                        </div>
                    ) : (
                        <p className="no-traits">No traits selected yet. Start spinning!</p>
                    )}
                </div>
            </div>
        </div>
    );
}