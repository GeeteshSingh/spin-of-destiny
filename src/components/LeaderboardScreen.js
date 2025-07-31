// src/components/LeaderboardScreen.js
"use client";

import { useState } from 'react';
import LeaderboardEntry from './LeaderboardEntry';

export default function LeaderboardScreen({ leaderboardData, onBackToMainMenu, playSound }) {
    const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('overpowered');

    const getSortedLeaderboard = (category) => {
        let sortedList = [...(leaderboardData[category] || [])]; // Ensure it's an array
        if (category === 'recent') {
            sortedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (category === 'overpowered') {
            sortedList.sort((a, b) => b.balance - a.balance);
        }
        // Add sorting for creative, comedy, redemption if you define criteria in gameLogic.js
        return sortedList;
    };

    const handleTabClick = (tabKey) => {
        setActiveLeaderboardTab(tabKey);
        playSound('select', 0.3);
    };

    return (
        <div className="container mx-auto max-w-6xl text-center">
            <div className="leaderboard-content bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal-800 mb-8">Leaderboards</h2>

                <div className="leaderboard-tabs flex flex-wrap justify-center gap-4 mb-8">
                    {Object.keys(leaderboardData).map(tabKey => (
                        <button
                            key={tabKey}
                            className={`tab-btn py-2 px-6 rounded-full font-semibold transition duration-300
                ${activeLeaderboardTab === tabKey ? 'bg-teal-400 text-white hover:bg-teal-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
                            onClick={() => handleTabClick(tabKey)}
                        >
                            {tabKey.charAt(0).toUpperCase() + tabKey.slice(1).replace(/([A-Z])/g, ' $1')}
                        </button>
                    ))}
                </div>

                <div className="leaderboard-content-area mb-8">
                    {Object.keys(leaderboardData).map(tabKey => (
                        <div
                            key={`tab-${tabKey}`}
                            id={`tab-${tabKey}`}
                            className={`leaderboard-tab ${activeLeaderboardTab === tabKey ? '' : 'hidden'}`}
                        >
                            <div className="leaderboard-list grid gap-4">
                                {getSortedLeaderboard(tabKey).length > 0 ? (
                                    getSortedLeaderboard(tabKey).map((char, index) => (
                                        <LeaderboardEntry key={index} character={char} />
                                    ))
                                ) : (
                                    <p className="text-gray-600">No entries yet for this category.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="leaderboard-actions">
                    <button className="btn btn--outline bg-transparent border-2 border-gray-400 text-gray-700 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out text-lg" onClick={onBackToMainMenu}>Back to Main Menu</button>
                </div>
            </div>
        </div>
    );
}