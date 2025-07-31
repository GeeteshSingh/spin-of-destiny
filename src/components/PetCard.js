// src/components/PetCard.js
"use client";

export default function PetCard({ pet, isSelected, onClick }) {
    return (
        <div
            className={`
        pet-card bg-gray-50 p-4 rounded-lg shadow-md border
        cursor-pointer hover:shadow-lg transition duration-300 text-center
        ${isSelected ? 'border-teal-400 bg-teal-50' : 'border-gray-200'}
      `}
            onClick={onClick}
        >
            <h3 className="text-xl font-semibold text-charcoal-800 mb-2">{pet.name}</h3>
            <p className="text-gray-700">{pet.description}</p>
        </div>
    );
}