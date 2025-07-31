// src/components/RedemptionScreen.js
"use client";

import PetCard from './PetCard';

export default function RedemptionScreen({ redemptionPets, selectedPet, onSelectPet, onConfirmSelection }) {
    return (
        <div className="container mx-auto max-w-4xl text-center">
            <div className="redemption-content bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal-800 mb-4">Choose Your Redemption Pet</h2>
                <p className="redemption-subtitle text-lg md:text-xl text-gray-700 mb-8">A companion to guide you through your destiny...</p>

                <div className="pet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {redemptionPets.map((pet) => (
                        <PetCard
                            key={pet.name}
                            pet={pet}
                            isSelected={selectedPet?.name === pet.name}
                            onClick={() => onSelectPet(pet)}
                        />
                    ))}
                </div>

                <div className="redemption-actions">
                    <button className="btn btn--primary bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out text-lg" onClick={onConfirmSelection}>Confirm Pet Selection</button>
                </div>
            </div>
        </div>
    );
}