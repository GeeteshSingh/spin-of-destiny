// src/components/PetRedemptionModal.js
"use client";

import { useState } from 'react';
import PetCard from './PetCard';

export default function PetRedemptionModal({ pets, onSelectPet, onDecline }) {
    const [selectedPet, setSelectedPet] = useState(null);

    const handlePetClick = (pet) => {
        setSelectedPet(pet);
    };

    const handleConfirm = () => {
        if (selectedPet) {
            onSelectPet(selectedPet);
        }
    };

    const handleDecline = () => {
        onDecline();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            🎉 Pet Bonus Unlocked! 🎉
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Fate has granted you the rare opportunity to choose a mystical companion!
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Choose wisely, or decline to walk the path alone...
                        </p>
                    </div>

                    {/* Pet Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {pets.map((pet, index) => (
                            <PetCard
                                key={index}
                                pet={pet}
                                isSelected={selectedPet?.name === pet.name}
                                onClick={() => handlePetClick(pet)}
                            />
                        ))}
                    </div>

                    {/* Selected Pet Display */}
                    {selectedPet && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Selected: {selectedPet.name}
                            </h3>
                            <p className="text-blue-700 dark:text-blue-200">
                                {selectedPet.description}
                            </p>
                            <div className="mt-2">
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {selectedPet.type}
                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedPet}
                            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                                selectedPet
                                    ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {selectedPet ? `Choose ${selectedPet.name}` : 'Select a Pet First'}
                        </button>

                        <button
                            onClick={handleDecline}
                            className="px-8 py-3 rounded-lg font-semibold text-lg bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Walk Alone
                        </button>
                    </div>

                    {/* Footer Text */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            This is a rare bonus! Only 10% of spins grant pet access.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}