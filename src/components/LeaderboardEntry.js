// src/components/LeaderboardEntry.js
import { gameData } from '../lib/gameData';

export default function LeaderboardEntry({ character }) {
    const traitsHtml = Object.entries(character.traits).map(([key, value]) => (
        <div key={key} className="text-sm">
            <span className="font-semibold text-gray-800">{gameData.categories[key]?.name || key}:</span>
            <span className={`${value.type === 'strong' ? 'text-green-600' : 'text-red-600'}`}>
        {value.name}
      </span>
        </div>
    ));

    const redemptionPetHtml = character.redemptionPet ? (
        <div className="text-sm mt-2">
            <span className="font-semibold text-gray-800">Pet:</span>
            <span className="text-indigo-600">{character.redemptionPet.name}</span>
        </div>
    ) : null;

    return (
        <div className="leaderboard-entry bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="character-info text-left flex-grow">
                <h4 className="text-lg font-bold text-charcoal-800">{character.name}</h4>
                <div className="character-meta text-gray-600 text-sm mt-1 flex flex-wrap gap-x-4">
                    <span>Balance: <span className={`font-semibold ${character.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>{character.balance}</span></span>
                    <span>Created: {new Date(character.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="character-traits grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {traitsHtml}
                    {redemptionPetHtml}
                </div>
            </div>
        </div>
    );
}