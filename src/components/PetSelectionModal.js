// src/components/PetSelectionModal.js - Pet Selection Modal (10% bonus chance)
'use client';

export default function PetSelectionModal({ onSelectPet, onDecline, pets }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-gold-500">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-4xl font-bold text-yellow-400 mb-2">
                        INCREDIBLE LUCK!
                    </h2>
                    <p className="text-xl text-white">
                        You've unlocked the rare Pet Redemption bonus! Choose a companion to join your quest, or walk alone.
                    </p>
                    <div className="text-sm text-gray-300 mt-2">
                        (Only 10% of players get this opportunity!)
                    </div>
                </div>

                {/* Pet Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {pets.map((pet, index) => (
                        <div
                            key={index}
                            onClick={() => onSelectPet(pet)}
                            className="bg-black bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200 transform hover:scale-105 border-2 border-transparent hover:border-yellow-400"
                        >
                            <div className="text-center">
                                {/* Pet Icon based on type */}
                                <div className="text-4xl mb-3">
                                    {pet.type === 'combat' && '🐉'}
                                    {pet.type === 'support' && '🔥'}
                                    {pet.type === 'stealth' && '🐺'}
                                    {pet.type === 'healing' && '🦄'}
                                    {pet.type === 'speed' && '🦅'}
                                    {pet.type === 'cosmic' && '🐱'}
                                    {pet.type === 'elemental' && '🦎'}
                                    {pet.type === 'magic' && '🦊'}
                                </div>

                                <h3 className="text-white font-bold text-lg mb-2">
                                    {pet.name}
                                </h3>

                                <div className="text-yellow-400 font-semibold mb-2">
                                    +{pet.power} Power
                                </div>

                                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                                    pet.rarity === 'legendary' ? 'bg-purple-600 text-purple-100' :
                                        pet.rarity === 'epic' ? 'bg-blue-600 text-blue-100' :
                                            pet.rarity === 'rare' ? 'bg-green-600 text-green-100' :
                                                'bg-gray-600 text-gray-100'
                                }`}>
                                    {pet.rarity.toUpperCase()}
                                </div>

                                <div className="text-gray-400 text-xs mt-2 capitalize">
                                    {pet.type} Type
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-6">
                    <button
                        onClick={onDecline}
                        className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
                    >
                        Walk Alone
                    </button>

                    <div className="text-gray-400 flex items-center">
                        or choose a companion above
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    Pet companions provide permanent power bonuses and unique abilities in future adventures
                </div>
            </div>
        </div>
    );
}