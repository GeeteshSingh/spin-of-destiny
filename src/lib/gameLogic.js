// src/lib/gameLogic.js
import { gameData } from './gameData';

// Moved from _app.js to be accessible by multiple components
export const initialGameState = {
    character: {},
    redemptionPet: null,
    characterBalance: 0,
    spinCount: 0,
    maxSpins: 7,
    leaderboard: {
        overpowered: [],
        creative: [],
        comedy: [],
        redemption: [],
        recent: []
    },
    commentaryText: "Awaiting your fate...", // Added default commentary text
    spinCategoryTitle: "Spinning for: Category",
    spinSubtitle: "Click to spin the wheel and reveal your destiny!",
    finalCharacterName: "",
    soundEnabled: true,
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
        const trait = characterTraits[category];
        if (trait.type === 'strong') {
            balance += 10;
        } else if (trait.type === 'weak') {
            balance -= 5;
        }
    }
    // Redemption pet bonus/penalty
    if (redemptionPet) {
        const petType = redemptionPet.type;
        if (['guidance', 'loyalty', 'insight', 'protection', 'wisdom', 'renewal'].includes(petType)) {
            balance += 5; // Positive pets
        } else if (petType === 'independence' && redemptionPet.name === 'No Redemption Pet') {
            balance -= 5; // Penalty for choosing no pet, assuming it's a "hard mode"
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
    }
    return "Awaiting your fate...";
};

export const getFinalCommentaryType = (balance, redemptionPet, characterTraits) => {
    if (balance > 40) {
        return 'overpowered';
    } else if (balance < -20) { // Example for comedy
        return 'comedy';
    } else if (redemptionPet && characterTraits.redemption_path?.type === 'strong') { // Example for redemption
        return 'redemption';
    } else {
        return 'creative'; // Default or based on specific trait combos
    }
};

export const loadLeaderboard = () => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
        const storedLeaderboard = localStorage.getItem('leaderboard');
        if (storedLeaderboard) {
            return JSON.parse(storedLeaderboard);
        }
    }
    return initialGameState.leaderboard; // Return default if nothing found
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
    document.body.appendChild(linkElement); // Append to body to make it clickable
    linkElement.click();
    document.body.removeChild(linkElement); // Clean up
};

export const audioConfig = {
    select: '/select.mp3', // Path to your sound file in /public
    spin: '/spin.mp3',     // Path to your sound file in /public
};