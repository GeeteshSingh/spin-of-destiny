// src/components/LeaderboardScreen.js - 4-Category Leaderboard System
'use client';

import { useState, useEffect } from 'react';
import { CHARACTER_TYPES } from '../lib/gameData';

export default function LeaderboardScreen({ onBack, onRestart }) {
    const [activeTab, setActiveTab] = useState('overall');
    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);

    useEffect(() => {
        loadCharacters();
    }, []);

    useEffect(() => {
        filterCharacters();
    }, [activeTab, characters]);

    const loadCharacters = () => {
        try {
            const data = localStorage.getItem('character_leaderboard');
            const loadedCharacters = data ? JSON.parse(data) : [];
            setCharacters(loadedCharacters);
        } catch (error) {
            console.error('Error loading characters:', error);
            setCharacters([]);
        }
    };

    const filterCharacters = () => {
        let filtered = [...characters];

        if (activeTab !== 'overall') {
            filtered = characters.filter(char => char.characterType === activeTab);
        }

        // Sort by power level (highest first)
        filtered.sort((a, b) => b.totalPower - a.totalPower);

        setFilteredCharacters(filtered);
    };

    const clearLeaderboard = () => {
        if (window.confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
            localStorage.removeItem('character_leaderboard');
            setCharacters([]);
            setFilteredCharacters([]);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getCharacterIcon = (type) => {
        switch (type) {
            case 'hero': return '⭐';
            case 'villain': return '💀';
            case 'anti-hero': return '⚡';
            default: return '❓';
        }
    };

    const tabs = [
        { id: 'overall', label: 'Overall', icon: '🏆', description: 'All Characters' },
        { id: 'hero', label: 'Heroes', icon: '⭐', description: 'Forces of Good' },
        { id: 'anti-hero', label: 'Anti-Heroes', icon: '⚡', description: 'Morally Complex' },
        { id: 'villain', label: 'Villains', icon: '💀', description: 'Forces of Evil' }
    ];

    const getTabStats = (tabId) => {
        const tabCharacters = tabId === 'overall' ? characters : characters.filter(c => c.characterType === tabId);
        return {
            count: tabCharacters.length,
            avgPower: tabCharacters.length > 0 ? Math.round(tabCharacters.reduce((sum, c) => sum + c.totalPower, 0) / tabCharacters.length) : 0,
            topPower: tabCharacters.length > 0 ? Math.max(...tabCharacters.map(c => c.totalPower)) : 0
        };
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        🏆 Hall of Legends
                    </h1>
                    <p className="text-xl text-gray-300 mb-6">
                        Compare your character's power level with others across different alignments
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
                        >
                            ← Back to Character
                        </button>
                        <button
                            onClick={onRestart}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold"
                        >
                            Create New Character
                        </button>
                        <button
                            onClick={clearLeaderboard}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                        >
                            Clear All Data
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-black bg-opacity-40 rounded-lg p-2 flex space-x-2">
                        {tabs.map(tab => {
                            const stats = getTabStats(tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 rounded-lg transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">{tab.icon}</div>
                                        <div className="font-bold text-sm">{tab.label}</div>
                                        <div className="text-xs opacity-75">{stats.count} chars</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {(() => {
                        const stats = getTabStats(activeTab);
                        return (
                            <>
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-20 rounded-lg p-6 border border-blue-400">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400 mb-1">
                                            {stats.count}
                                        </div>
                                        <div className="text-white text-sm">
                                            Total Characters
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-opacity-20 rounded-lg p-6 border border-yellow-400">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-400 mb-1">
                                            {stats.avgPower.toLocaleString()}
                                        </div>
                                        <div className="text-white text-sm">
                                            Average Power
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-red-600 to-pink-600 bg-opacity-20 rounded-lg p-6 border border-red-400">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-red-400 mb-1">
                                            {stats.topPower.toLocaleString()}
                                        </div>
                                        <div className="text-white text-sm">
                                            Highest Power
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* Leaderboard Table */}
                {filteredCharacters.length > 0 ? (
                    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl border-2 border-white shadow-2xl overflow-hidden">
                        <div className="bg-black bg-opacity-40 p-6 border-b border-gray-600">
                            <h2 className="text-2xl font-bold text-white text-center">
                                {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label} Leaderboard
                            </h2>
                            <p className="text-gray-300 text-center mt-1">
                                {tabs.find(t => t.id === activeTab)?.description}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black bg-opacity-30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Character
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Power Level
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Tier
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Pet
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Created
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-600">
                                {filteredCharacters.map((character, index) => {
                                    const rank = index + 1;
                                    return (
                                        <tr
                                            key={character.id}
                                            className={`hover:bg-black hover:bg-opacity-20 transition-colors duration-200 ${
                                                rank <= 3 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-opacity-10' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                            <span className={`text-2xl mr-2 ${
                                rank <= 3 ? 'animate-pulse' : ''
                            }`}>
                              {getRankIcon(rank)}
                            </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-2xl mr-3">
                                                        {getCharacterIcon(character.characterType)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {character.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400 capitalize">
                                                            {character.characterType.replace('-', ' ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg font-bold text-yellow-400">
                                                    {character.totalPower.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border"
                              style={{
                                  backgroundColor: character.powerTier.color + '20',
                                  borderColor: character.powerTier.color,
                                  color: character.powerTier.color
                              }}
                          >
                            {character.powerTier.label}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {character.traits.pet ? (
                                                    <div className="text-xs">
                                                        <div className="text-yellow-400 font-semibold">
                                                            {character.traits.pet.name}
                                                        </div>
                                                        <div className="text-gray-400">
                                                            +{character.traits.pet.power}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-xs">None</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                {new Date(character.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            No Characters Yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {activeTab === 'overall'
                                ? 'Create your first character to start the leaderboard!'
                                : `No ${activeTab.replace('-', ' ')} characters have been created yet.`
                            }
                        </p>
                        <button
                            onClick={onRestart}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-bold shadow-lg transform hover:scale-105"
                        >
                            Create Your First Character
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}