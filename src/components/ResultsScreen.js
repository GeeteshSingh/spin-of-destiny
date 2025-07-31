// src/components/ResultScreen.js
"use client";

import CharacterPanel from './CharacterPanel';

export default function ResultScreen({
                                         character,
                                         redemptionPet,
                                         characterBalance,
                                         finalCharacterName,
                                         commentaryText, // Displayed as overall commentary on results
                                         onSaveCharacter,
                                         onStartNewGame,
                                         onViewLeaderboards
                                     }) {
    return (
        <div className="container mx-auto max-w-4xl text-center">
            <div className="results-content bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal-800 mb-4">Your Destiny Unveiled!</h2>
                <p className="results-subtitle text-lg md:text-xl text-gray-700 mb-8">Behold, your newly forged
                    character:</p>

                <CharacterPanel
                    character={character}
                    redemptionPet={redemptionPet}
                    balance={characterBalance}
                    finalName={finalCharacterName}
                />
                <p className="commentary text-base italic text-gray-600 mt-4">{commentaryText}</p>

                <div className="results-actions flex flex-col md:flex-row justify-center gap-4 mt-8">
                    <button
                        className="btn btn--primary bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out text-lg"
                        onClick={onSaveCharacter}>Save Character
                    </button>
                    <button
                        className="btn btn--secondary bg-transparent border-2 border-teal-400 text-teal-700 hover:bg-teal-400 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out text-lg"
                        onClick={onStartNewGame}>Create New Character
                    </button>
                    <button
                        className="btn btn--outline bg-transparent border-2 border-gray-400 text-gray-700 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out text-lg"
                        onClick={onViewLeaderboards}>View Leaderboards
                    </button>
                </div>
            </div>
        </div>
    );
}