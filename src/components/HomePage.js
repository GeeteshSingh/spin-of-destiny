// src/components/HomePage.js
"use client";

import { useState, useEffect } from 'react';
import { useGameState } from './GameProvider';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';
import ResultScreen from './ResultsScreen';
import LeaderboardScreen from './LeaderboardScreen';
import PetRedemptionModal from './RedemptionScreen';
import {
    initialGameState,
    calculateCharacterBalance,
    getFinalCommentaryType,
    generateCharacterName,
    exportCharacter,
    isPetRedemptionSpin
} from '@/lib/gameLogic';
import { gameData } from '@/lib/gameData';

export default function HomePage() {
    const { gameState, setGameState, playSound, updateLeaderboard } = useGameState();
    const [currentScreen, setCurrentScreen] = useState('welcome');

    // Destructure game state for easier access
    const {
        character,
        redemptionPet,
        characterBalance,
        spinCount,
        maxSpins,
        leaderboard,
        showPetSelectionModal
    } = gameState;

    // --- Callbacks for screen transitions ---
    const handleStartGame = () => {
        // Reset game state for a new character creation and go directly to game
        setGameState(initialGameState);
        setCurrentScreen('game');
        playSound('select', 0.3);
    };

    const handleViewLeaderboards = () => {
        setCurrentScreen('leaderboard');
        playSound('select', 0.3);
    };

    // Handle spin updates during the game
    const handleSpinUpdate = (updateFunction) => {
        setGameState(updateFunction);
    };

    // Handle when a spin is completed
    const handleSpinComplete = (finalCharacterTraits, spinResult = null) => {
        const newSpinCount = spinCount + 1;

        // Check if this was the pet redemption spin (8th spin)
        if (isPetRedemptionSpin(spinCount)) {
            if (spinResult === "Pet Bonus Available!") {
                // Show pet selection modal
                setGameState(prev => ({
                    ...prev,
                    character: finalCharacterTraits,
                    spinCount: newSpinCount,
                    showPetSelectionModal: true
                }));
            } else {
                // "NO" was selected, continue to results without pet
                handleGameEnd(finalCharacterTraits, null);
            }
        } else if (newSpinCount === maxSpins) {
            // All regular spins are done, ready for pet redemption spin
            setGameState(prev => ({
                ...prev,
                character: finalCharacterTraits,
                spinCount: newSpinCount
            }));
        } else {
            // Regular spin completed, continue to next spin
            setGameState(prev => ({
                ...prev,
                character: finalCharacterTraits,
                spinCount: newSpinCount
            }));
        }
    };

    // Handle pet selection from modal
    const handlePetSelection = (selectedPet) => {
        setGameState(prev => ({
            ...prev,
            redemptionPet: selectedPet,
            showPetSelectionModal: false
        }));
        // Now proceed to game end with the selected pet
        handleGameEnd(character, selectedPet);
    };

    // Handle declining pet selection
    const handleDeclinePet = () => {
        setGameState(prev => ({
            ...prev,
            showPetSelectionModal: false
        }));
        // Proceed to game end without pet
        handleGameEnd(character, null);
    };

    const handleGameEnd = (finalCharacterTraits, finalPet = redemptionPet) => {
        // Calculate final balance and commentary
        const finalBalance = calculateCharacterBalance(finalCharacterTraits, finalPet);
        const finalCommentary = getFinalCommentaryType(finalBalance, finalPet, finalCharacterTraits);
        const finalName = generateCharacterName(finalCharacterTraits);

        setGameState(prev => ({
            ...prev,
            character: finalCharacterTraits,
            redemptionPet: finalPet,
            characterBalance: finalBalance,
            commentaryText: gameData.commentary.final[finalCommentary][Math.floor(Math.random() * gameData.commentary.final[finalCommentary].length)],
            finalCharacterName: finalName,
        }));

        setCurrentScreen('results');
        playSound('select', 0.3);
    };

    const handleSaveCharacter = () => {
        const characterDataToSave = {
            name: gameState.finalCharacterName,
            traits: { ...gameState.character },
            redemptionPet: gameState.redemptionPet,
            balance: gameState.characterBalance,
            createdAt: new Date().toISOString()
        };

        exportCharacter(characterDataToSave);

        // Update leaderboards
        const newLeaderboard = { ...leaderboard };
        newLeaderboard.recent.unshift(characterDataToSave);

        // Add to specific leaderboards based on balance/characteristics
        if (characterDataToSave.balance > 40) {
            newLeaderboard.overpowered.unshift(characterDataToSave);
        }

        updateLeaderboard(newLeaderboard);

        alert('Character saved and added to leaderboards!');
        playSound('select', 0.3);
    };

    const handleStartNewGame = () => {
        setGameState(initialGameState);
        setCurrentScreen('welcome');
        playSound('select', 0.3);
    };

    const handleBackToMainMenu = () => {
        setGameState(initialGameState);
        setCurrentScreen('welcome');
        playSound('select', 0.3);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {currentScreen === 'welcome' && (
                <WelcomeScreen
                    onStartGame={handleStartGame}
                    onViewLeaderboards={handleViewLeaderboards}
                />
            )}

            {currentScreen === 'game' && (
                <GameScreen
                    character={character}
                    spinCount={spinCount}
                    maxSpins={maxSpins}
                    commentaryText={gameState.commentaryText}
                    spinCategoryTitle={gameState.spinCategoryTitle}
                    spinSubtitle={gameState.spinSubtitle}
                    onSpinUpdate={handleSpinUpdate}
                    onSpinComplete={handleSpinComplete}
                    playSound={playSound}
                />
            )}

            {currentScreen === 'results' && (
                <ResultScreen
                    character={character}
                    redemptionPet={redemptionPet}
                    characterBalance={characterBalance}
                    finalCharacterName={gameState.finalCharacterName}
                    commentaryText={gameState.commentaryText}
                    onSaveCharacter={handleSaveCharacter}
                    onStartNewGame={handleStartNewGame}
                    onViewLeaderboards={handleViewLeaderboards}
                />
            )}

            {currentScreen === 'leaderboard' && (
                <LeaderboardScreen
                    leaderboardData={leaderboard}
                    onBackToMainMenu={handleBackToMainMenu}
                    playSound={playSound}
                />
            )}

            {showPetSelectionModal && (
                <PetRedemptionModal
                    pets={gameData.redemptionPets}
                    onSelectPet={handlePetSelection}
                    onDecline={handleDeclinePet}
                />
            )}
        </div>
    );
}