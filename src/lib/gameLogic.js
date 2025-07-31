// src/lib/gameLogic.js

import { gameData } from './gameData';

// Updated game state with 8 spins instead of 7
export const initialGameState = {
    character: {},
    redemptionPet: null,
    characterBalance: 0,
    spinCount: 0,
    maxSpins: 8, // Changed from 7 to 8 to include pet redemption spin
    leaderboard: {
        overpowered: [],
        creative: [],
        comedy: [],
        redemption: [],
        recent: []
    },
    commentaryText: "Awaiting your fate...",
    spinCategoryTitle: "Spinning for: Category",
    spinSubtitle: "Click to spin the wheel and reveal your destiny!",
    finalCharacterName: "",
    soundEnabled: true,
    showPetSelectionModal: false, // New state for pet selection modal
};

export const generateCharacterName = (characterTraits) => {
    const species = characterTraits.species?.name || 'Mysterious';
    const power = characterTraits.powers?.name || 'Powerful';
    const origin = characterTraits.origin?.name || 'Origin';

    const adjectives = ["Epic", "Legendary", "Shadow", "Celestial", "Whispering", "Ancient", "Radiant", "Iron", "Silent", "Crimson"];
    const nouns = ["Champion", "Guardian", "Wanderer", "Seeker", "Sentinel", "Scout", "Architect", "Sovereign", "Echo", "Harbinger"];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${species} ${randomNoun} of ${power}`;
};

export const calculateCharacterBalance = (characterTraits, redemptionPet) => {
    let balance = 0;

    for (const category in characterTraits) {
        // Skip pet_redemption when calculating balance as it's handled separately
        if (category === 'pet_redemption') continue;

        const trait = characterTraits[category];
        if (trait.type === 'strong') {
            balance += 10;
        } else if (trait.type === 'weak') {
            balance -= 5;
        }
    }

    // Redemption pet bonus/penalty
    if (redemptionPet && redemptionPet.name !== 'No Redemption Pet') {
        const petType = redemptionPet.type;
        if (['guidance', 'loyalty', 'insight', 'protection', 'wisdom', 'renewal'].includes(petType)) {
            balance += 5; // Positive pets add bonus
        }
    }

    return balance;
};

export const getCommentary = (type, strength = null, finalType = null) => {
    if (type === 'spinStart') {
        return gameData.commentary.spinStart[Math.floor(Math.random() * gameData.commentary.spinStart.length)];
    } else if (type === 'spinEnd' && strength) {
        return gameData.commentary.spinEnd[strength][Math.floor(Math.random() * gameData.commentary.spinEnd[strength].length)];
    } else if (type === 'final' && finalType) {
        return gameData.commentary.final[finalType][Math.floor(Math.random() * gameData.commentary.final[finalType].length)];
    } else if (type === 'petAvailable') {
        return gameData.commentary.petRedemption.petAvailable[Math.floor(Math.random() * gameData.commentary.petRedemption.petAvailable.length)];
    } else if (type === 'noPet') {
        return gameData.commentary.petRedemption.noPet[Math.floor(Math.random() * gameData.commentary.petRedemption.noPet.length)];
    }

    return "Awaiting your fate...";
};

export const getFinalCommentaryType = (balance, redemptionPet, characterTraits) => {
    if (balance > 40) {
        return 'overpowered';
    } else if (balance < -20) {
        return 'comedy';
    } else if (redemptionPet && characterTraits.redemption_path?.type === 'strong') {
        return 'redemption';
    } else {
        return 'creative';
    }
};

// Get categories to spin in order (excluding pet_redemption for now)
export const getCategoriesToSpin = () => {
    const allCategories = Object.keys(gameData.categories);
    // Return first 7 categories (character traits), pet_redemption will be handled specially as 8th spin
    return allCategories.filter(cat => cat !== 'pet_redemption').slice(0, 7);
};

// Check if current spin is the pet redemption spin
export const isPetRedemptionSpin = (spinCount) => {
    return spinCount === 7; // 8th spin (0-indexed, so 7)
};

export const loadLeaderboard = () => {
    if (typeof window !== 'undefined') {
        const storedLeaderboard = localStorage.getItem('leaderboard');
        if (storedLeaderboard) {
            return JSON.parse(storedLeaderboard);
        }
    }
    return initialGameState.leaderboard;
};

export const saveLeaderboard = (leaderboard) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
};

export const exportCharacter = (characterData) => {
    const dataStr = JSON.stringify(characterData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${characterData.name.replace(/\s+/g, '_')}_Character.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
};

export const audioConfig = {
    select: '/select.mp3',
    spin: '/spin.mp3',
};