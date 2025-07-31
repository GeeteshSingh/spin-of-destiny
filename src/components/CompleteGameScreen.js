// src/components/CompleteGameScreen.js - Full 8-Spin Character Creation
'use client';

import { useState, useEffect, useRef } from 'react';
import { SPIN_DATA, GAME_PHASES, PET_OPTIONS, calculateCharacterPower, determineCharacterType, POWER_TIERS } from '../lib/gameData';
import PetSelectionModal from './PetSelectionModal';
import CharacterResultScreen from './CharacterResultScreen';

export default function CompleteGameScreen() {
    const wheelRef = useRef(null);
    const [currentWheel, setCurrentWheel] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentSpin, setCurrentSpin] = useState(1);
    const [characterTraits, setCharacterTraits] = useState({});
    const [showPetModal, setShowPetModal] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [finalCharacter, setFinalCharacter] = useState(null);

    // Initialize wheel when component mounts or spin changes
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Winwheel || !window.TweenMax) {
            return;
        }

        const currentPhase = GAME_PHASES[currentSpin];
        const currentData = SPIN_DATA[currentPhase];

        if (!currentData) return;

        // Destroy existing wheel
        if (wheelRef.current) {
            wheelRef.current.stopAnimation(false);
        }

        // Configure wheel based on current spin
        const wheelConfig = {
            canvasId: 'game-wheel-canvas',
            numSegments: currentData.segments.length,
            outerRadius: 200,
            innerRadius: 30,
            textFontSize: 16,
            textFontWeight: 'bold',
            textFillStyle: '#000',
            textOrientation: 'horizontal',
            segments: currentData.segments.map((segment, index) => ({
                fillStyle: segment.fillStyle,
                text: segment.text,
                strokeStyle: '#fff',
                lineWidth: 2
            })),
            animation: {
                type: 'spinToStop',
                duration: 4 + Math.random() * 2, // 4-6 seconds
                spins: 8 + Math.random() * 4, // 8-12 spins
                callbackFinished: handleSpinComplete
            },
            pins: {
                number: currentData.segments.length,
                fillStyle: '#fff',
                outerRadius: 8
            }
        };

        const wheel = new window.Winwheel(wheelConfig);
        setCurrentWheel(wheel);
        wheelRef.current = wheel;

        return () => {
            if (wheelRef.current) {
                wheelRef.current.stopAnimation(false);
            }
        };
    }, [currentSpin]);

    const handleSpinClick = () => {
        if (!currentWheel || isSpinning) return;

        setIsSpinning(true);

        try {
            // Reset wheel rotation
            currentWheel.rotationAngle = 0;
            currentWheel.startAnimation();
        } catch (error) {
            console.error('Error starting wheel animation:', error);
            setIsSpinning(false);
        }
    };

    const handleSpinComplete = () => {
        setIsSpinning(false);

        if (!currentWheel) return;

        const winningSegment = currentWheel.getIndicatedSegment();
        const currentPhase = GAME_PHASES[currentSpin];
        const currentData = SPIN_DATA[currentPhase];

        // Find the matching segment data
        const segmentData = currentData.segments.find(seg => seg.text === winningSegment.text);

        if (segmentData) {
            // Handle pet redemption special case
            if (currentPhase === 'pet_redemption') {
                if (segmentData.value === 'pet_available') {
                    setShowPetModal(true);
                    return; // Don't advance until pet selection is complete
                } else {
                    // No pet selected, complete the character
                    completeCharacterCreation();
                    return;
                }
            }

            // Store the trait
            setCharacterTraits(prev => ({
                ...prev,
                [currentPhase]: segmentData
            }));

            // Move to next spin after a brief delay
            setTimeout(() => {
                if (currentSpin < 8) {
                    setCurrentSpin(prev => prev + 1);
                }
            }, 2000);
        }
    };

    const handlePetSelection = (selectedPet) => {
        // Add pet to character traits
        const updatedTraits = {
            ...characterTraits,
            pet_redemption: { text: "PET BONUS!", value: "pet_available", power: 500 },
            pet: selectedPet
        };

        setCharacterTraits(updatedTraits);
        setShowPetModal(false);
        completeCharacterCreation(updatedTraits);
    };

    const handleNoPet = () => {
        setCharacterTraits(prev => ({
            ...prev,
            pet_redemption: { text: "NO", value: "no_pet", power: 0 }
        }));
        setShowPetModal(false);
        completeCharacterCreation();
    };

    const completeCharacterCreation = (traits = characterTraits) => {
        const totalPower = calculateCharacterPower(traits);
        const characterType = determineCharacterType(traits);

        // Find power tier
        const powerTier = Object.entries(POWER_TIERS).find(([key, tier]) =>
            totalPower >= tier.min && totalPower <= tier.max
        )?.[1] || POWER_TIERS.E;

        const character = {
            id: Date.now(),
            name: generateCharacterName(traits),
            traits,
            totalPower,
            characterType,
            powerTier,
            createdAt: new Date().toISOString()
        };

        setFinalCharacter(character);
        setGameComplete(true);
    };

    const generateCharacterName = (traits) => {
        const classNames = {
            warrior: "Warrior",
            mage: "Mage",
            rogue: "Rogue",
            paladin: "Paladin",
            archer: "Archer",
            berserker: "Berserker",
            monk: "Monk",
            necromancer: "Necromancer"
        };

        const baseClass = traits.character_class?.value || "unknown";
        const alignment = traits.moral_alignment?.value || "neutral";

        return `${classNames[baseClass] || "Unknown"} of ${alignment.replace(/_/g, ' ')}`;
    };

    const getCurrentPhaseData = () => {
        const currentPhase = GAME_PHASES[currentSpin];
        return SPIN_DATA[currentPhase];
    };

    const resetGame = () => {
        setCurrentSpin(1);
        setCharacterTraits({});
        setGameComplete(false);
        setFinalCharacter(null);
        setShowPetModal(false);
    };

    // Show final character screen
    if (gameComplete && finalCharacter) {
        return <CharacterResultScreen character={finalCharacter} onRestart={resetGame} />;
    }

    const currentPhaseData = getCurrentPhaseData();

    if (!currentPhaseData) {
        return <div className="text-white text-center">Loading game data...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            {/* Game Progress */}
            <div className="mb-8 text-center">
                <div className="text-white text-sm mb-2">
                    Spin {currentSpin} of 8
                </div>
                <div className="w-full max-w-md bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(currentSpin / 8) * 100}%` }}
                    />
                </div>
            </div>

            {/* Current Spin Info */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    {currentPhaseData.title}
                </h1>
                <p className="text-xl text-gray-300">
                    {currentPhaseData.description}
                </p>
            </div>

            {/* Spinning Wheel */}
            <div className="mb-8 relative">
                <canvas
                    id="game-wheel-canvas"
                    width="400"
                    height="400"
                    className="border-4 border-white rounded-full shadow-2xl"
                />

                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
            </div>

            {/* Spin Button */}
            <button
                onClick={handleSpinClick}
                disabled={isSpinning}
                className={`px-12 py-4 text-xl font-bold text-white rounded-lg transition-all duration-200 ${
                    isSpinning
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 shadow-lg'
                }`}
            >
                {isSpinning ? 'Spinning...' : `SPIN FOR ${currentPhaseData.title.toUpperCase()}!`}
            </button>

            {/* Current Traits Display */}
            {Object.keys(characterTraits).length > 0 && (
                <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-6 max-w-md">
                    <h3 className="text-white text-lg font-semibold mb-4">Your Character So Far:</h3>
                    <div className="space-y-2">
                        {Object.entries(characterTraits).map(([key, trait]) => (
                            <div key={key} className="text-gray-300 text-sm">
                                <span className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}:</span> {trait.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pet Selection Modal */}
            {showPetModal && (
                <PetSelectionModal
                    onSelectPet={handlePetSelection}
                    onDecline={handleNoPet}
                    pets={PET_OPTIONS}
                />
            )}
        </div>
    );
}