// src/components/CharacterPanel.js
import { gameData } from '../lib/gameData';

export default function CharacterPanel({ character, redemptionPet, balance, finalName }) {
    return (
        <div className="character-panel bg-gray-100 p-6 rounded-lg border border-gray-300 text-left mb-8">
            <h3 className="text-2xl font-bold text-charcoal-800 mb-4">{finalName}</h3>
            <div className="final-traits grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(character).map(([category, trait]) => (
                    <div key={category} className="trait-item bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h4 className="font-semibold text-charcoal-800">{gameData.categories[category]?.name || category}:</h4>
                        <p className={`text-gray-700 ${trait.type === 'strong' ? 'text-green-600' : 'text-red-600'}`}>
                            {trait.name}
                        </p>
                    </div>
                ))}
            </div>
            <p className="redemption-pet-display text-lg mt-4 text-gray-700" dangerouslySetInnerHTML={{
                __html: redemptionPet ?
                    `Your loyal companion: <span class="font-bold text-indigo-600">${redemptionPet.name}</span> (${redemptionPet.description})` :
                    "You chose to walk the path alone."
            }} />
            <p className={`balance-display text-xl font-semibold mt-2 ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Overall Balance: {balance}
            </p>
        </div>
    );
}