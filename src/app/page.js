// src/app/page.js
"use client"; // This component needs to be a Client Component

import { useState, useEffect } from 'react';
import { useGameState } from './layout'; // Import from the layout context
import WelcomeScreen from '../components/WelcomeScreen';
import RedemptionScreen from '../components/RedemptionScreen';
import GameScreen from '../components/GameScreen';
import ResultScreen from '../components/ResultsScreen';
import LeaderboardScreen from '../components/LeaderboardScreen';
import { initialGameState, calculateCharacterBalance, getFinalCommentaryType, generateCharacterName, exportCharacter } from '@/lib/gameLogic';
import { gameData } from '@/lib/gameData'; // For accessing categories in results screen


export default function HomePage() {
    const { gameState, setGameState, playSound, updateLeaderboard } = useGameState();
    const [currentScreen, setCurrentScreen] = useState('welcome'); // State to manage which screen is active

    // Destructure game state for easier access in components
    const { character, redemptionPet, characterBalance, spinCount, maxSpins, leaderboard } = gameState;

    // --- Callbacks for screen transitions ---
    const handleStartGame = () => {
        // Reset game state for a new character creation
        setGameState(initialGameState);
        setCurrentScreen('redemption');
        playSound('select', 0.3);
    };

    const handleViewLeaderboards = () => {
        setCurrentScreen('leaderboard');
        playSound('select', 0.3);
    };

    const handleConfirmPetSelection = (selectedPet) => {
        if (selectedPet) {
            setGameState(prev => ({ ...prev, redemptionPet: selectedPet }));
            setCurrentScreen('game');
            // Initialize game loop specific states here if needed
            setGameState(prev => ({ ...prev, spinCount: 0, character: {} })); // Reset for game start
            playSound('select', 0.3);
        } else {
            alert('Please select a redemption pet!');
        }
    };

    const handleGameEnd = (finalCharacterTraits) => {
        // Calculate final balance and commentary here, then transition
        const finalBalance = calculateCharacterBalance(finalCharacterTraits, redemptionPet);
        const finalCommentary = getFinalCommentaryType(finalBalance, redemptionPet, finalCharacterTraits);
        const finalName = generateCharacterName(finalCharacterTraits);

        setGameState(prev => ({
            ...prev,
            character: finalCharacterTraits,
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

        exportCharacter(characterDataToSave); // Save as JSON

        // Update leaderboards
        const newLeaderboard = { ...leaderboard };
        newLeaderboard.recent.unshift(characterDataToSave); // Always add to recent

        // Add to specific leaderboards based on balance/characteristics
        if (characterDataToSave.balance > 40) {
            newLeaderboard.overpowered.unshift(characterDataToSave);
        }
        // Implement logic for creative, comedy, redemption scores if applicable

        updateLeaderboard(newLeaderboard); // Update global state and localStorage
        alert('Character saved and added to leaderboards!');
        playSound('select', 0.3);
    };

    const handleStartNewGame = () => {
        setGameState(initialGameState); // Reset all game state
        setCurrentScreen('welcome');
        playSound('select', 0.3);
    };

    const handleBackToMainMenu = () => {
        setGameState(initialGameState); // Reset all game state
        setCurrentScreen('welcome');
        playSound('select', 0.3);
    };


    return (
        <div className="relative flex-grow flex justify-center items-center p-4"> {/* Container for screens */}
            {currentScreen === 'welcome' && (
                <WelcomeScreen
                    onStartGame={handleStartGame}
                    onViewLeaderboards={handleViewLeaderboards}
                />
            )}

            {currentScreen === 'redemption' && (
                <RedemptionScreen
                    redemptionPets={gameData.redemptionPets}
                    selectedPet={redemptionPet}
                    onSelectPet={(pet) => setGameState(prev => ({ ...prev, redemptionPet: pet }))}
                    onConfirmSelection={() => handleConfirmPetSelection(redemptionPet)}
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
                    onSpinUpdate={setGameState} // Pass setGameState for GameScreen to update itself
                    onGameEnd={handleGameEnd}
                    playSound={playSound} // Pass playSound to GameScreen
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
        </div>
    );
}