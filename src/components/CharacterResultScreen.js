// src/components/CharacterResultScreen.js - Final Character Display & Leaderboard Integration
'use client';

import { useState, useEffect } from 'react';
import { POWER_TIERS } from '../lib/gameData';
import LeaderboardScreen from './LeaderboardScreen';

export default function CharacterResultScreen({ character, onRestart }) {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [savedToLeaderboard, setSavedToLeaderboard] = useState(false);

    useEffect(() => {
        // Auto-save character to leaderboard
        saveToLeaderboard();
    }, [character]);

    const saveToLeaderboard = () => {
        try {
            // Get existing leaderboard data
            const existingData = localStorage.getItem('character_leaderboard');
            const leaderboard = existingData ? JSON.parse(existingData) : [];

            // Add new character
            leaderboard.push(character);

            // Save back to localStorage
            localStorage.setItem('character_leaderboard', JSON.stringify(leaderboard));
            setSavedToLeaderboard(true);
        } catch (error) {
            console.error('Error saving to leaderboard:', error);
        }
    };

    const getPowerTierDisplay = (tier) => {
        return {
            backgroundColor: tier.color + '20',
            borderColor: tier.color,
            color: tier.color
        };
    };

    const formatTraitName = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (showLeaderboard) {
        return (
            <LeaderboardScreen
                onBack={() => setShowLeaderboard(false)}
                onRestart={onRestart}
            />
        );
    }

    const tierStyle = getPowerTierDisplay(character.powerTier);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">
                        {character.characterType === 'hero' && '⭐'}
                        {character.characterType === 'villain' && '💀'}
                        {character.characterType === 'anti-hero' && '⚡'}
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Your Character is Complete!
                    </h1>
                    <div className="text-xl text-gray-300">
                        Behold your creation, forged by the Spin of Destiny...
                    </div>
                </div>

                {/* Character Card */}
                <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 border-4 border-white shadow-2xl mb-8">
                    {/* Character Name & Type */}
                    <div className="text-center mb-6">
                        <h2 className="text-4xl font-bold text-white mb-2">
                            {character.name}
                        </h2>
                        <div className="flex justify-center items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                  character.characterType === 'hero' ? 'bg-blue-600 text-blue-100' :
                      character.characterType === 'villain' ? 'bg-red-600 text-red-100' :
                          'bg-purple-600 text-purple-100'
              }`}>
                {character.characterType.replace('-', ' ')}
              </span>
                            <div
                                className="px-4 py-2 rounded-full text-sm font-bold border-2"
                                style={tierStyle}
                            >
                                {character.powerTier.label}
                            </div>
                        </div>
                    </div>

                    {/* Power Level */}
                    <div className="text-center mb-8">
                        <div className="text-6xl font-bold text-yellow-400 mb-2">
                            {character.totalPower.toLocaleString()}
                        </div>
                        <div className="text-xl text-gray-300">
                            Total Power Level
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                            <div
                                className="h-4 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${Math.min((character.totalPower / 10000) * 100, 100)}%`,
                                    background: `linear-gradient(90deg, ${character.powerTier.color}40, ${character.powerTier.color})`
                                }}
                            />
                        </div>
                    </div>

                    {/* Character Traits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {Object.entries(character.traits).map(([key, trait]) => {
                            if (key === 'pet' || !trait.text) return null;

                            return (
                                <div key={key} className="bg-black bg-opacity-30 rounded-lg p-4">
                                    <div className="text-gray-400 text-sm font-medium mb-1">
                                        {formatTraitName(key)}
                                    </div>
                                    <div className="text-white text-lg font-semibold mb-1">
                                        {trait.text}
                                    </div>
                                    <div className="text-yellow-400 text-sm">
                                        {trait.power > 0 ? '+' : ''}{trait.power} Power
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pet Display (if applicable) */}
                    {character.traits.pet && (
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-opacity-20 rounded-lg p-6 border-2 border-yellow-400 mb-6">
                            <div className="text-center">
                                <div className="text-4xl mb-2">
                                    {character.traits.pet.type === 'combat' && '🐉'}
                                    {character.traits.pet.type === 'support' && '🔥'}
                                    {character.traits.pet.type === 'stealth' && '🐺'}
                                    {character.traits.pet.type === 'healing' && '🦄'}
                                    {character.traits.pet.type === 'speed' && '🦅'}
                                    {character.traits.pet.type === 'cosmic' && '🐱'}
                                    {character.traits.pet.type === 'elemental' && '🦎'}
                                    {character.traits.pet.type === 'magic' && '🦊'}
                                </div>
                                <div className="text-yellow-400 text-xl font-bold mb-1">
                                    Companion: {character.traits.pet.name}
                                </div>
                                <div className="text-white">
                                    +{character.traits.pet.power} Bonus Power • {character.traits.pet.rarity.toUpperCase()} Rarity
                                </div>
                                <div className="text-sm text-gray-300 mt-1">
                                    🎉 You were one of the lucky 10% to receive a pet companion!
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6 mb-8">
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg transform hover:scale-105"
                    >
                        View Leaderboards
                    </button>

                    <button
                        onClick={onRestart}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold text-lg shadow-lg transform hover:scale-105"
                    >
                        Create Another Character
                    </button>
                </div>

                {/* Save Confirmation */}
                {savedToLeaderboard && (
                    <div className="text-center text-green-400 font-semibold">
                        ✅ Character saved to leaderboard!
                    </div>
                )}

                {/* Character Stats Summary */}
                <div className="bg-black bg-opacity-30 rounded-lg p-6 text-center">
                    <div className="text-gray-400 text-sm mb-2">Character Creation Complete</div>
                    <div className="text-white">
                        Created on {new Date(character.createdAt).toLocaleDateString()} •
                        Power Tier: {character.powerTier.label} •
                        Type: {character.characterType.replace('-', ' ').toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
}