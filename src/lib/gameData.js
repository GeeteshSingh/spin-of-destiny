// src/data/gameData.js - Complete 8-Spin Character Creation System

export const GAME_PHASES = {
    1: 'character_class',
    2: 'origin_story',
    3: 'power_source',
    4: 'primary_ability',
    5: 'weakness',
    6: 'personality_trait',
    7: 'moral_alignment',
    8: 'pet_redemption'
};

export const SPIN_DATA = {
    character_class: {
        title: "Character Class",
        description: "What type of warrior are you?",
        segments: [
            { text: "Warrior", value: "warrior", fillStyle: "#FF6B6B", power: 800 },
            { text: "Mage", value: "mage", fillStyle: "#4ECDC4", power: 750 },
            { text: "Rogue", value: "rogue", fillStyle: "#45B7D1", power: 700 },
            { text: "Paladin", value: "paladin", fillStyle: "#96CEB4", power: 850 },
            { text: "Archer", value: "archer", fillStyle: "#FFEAA7", power: 650 },
            { text: "Berserker", value: "berserker", fillStyle: "#DDA0DD", power: 900 },
            { text: "Monk", value: "monk", fillStyle: "#98D8C8", power: 720 },
            { text: "Necromancer", value: "necromancer", fillStyle: "#F7DC6F", power: 780 }
        ]
    },

    origin_story: {
        title: "Origin Story",
        description: "How did your journey begin?",
        segments: [
            { text: "Chosen One", value: "chosen_one", fillStyle: "#FF6B6B", power: 500 },
            { text: "Tragic Past", value: "tragic_past", fillStyle: "#4ECDC4", power: 400 },
            { text: "Noble Birth", value: "noble_birth", fillStyle: "#45B7D1", power: 300 },
            { text: "Street Orphan", value: "street_orphan", fillStyle: "#96CEB4", power: 350 },
            { text: "Cursed Bloodline", value: "cursed_bloodline", fillStyle: "#FFEAA7", power: 450 },
            { text: "Divine Blessing", value: "divine_blessing", fillStyle: "#DDA0DD", power: 550 },
            { text: "Scientific Accident", value: "scientific_accident", fillStyle: "#98D8C8", power: 420 },
            { text: "Ancient Prophecy", value: "ancient_prophecy", fillStyle: "#F7DC6F", power: 480 }
        ]
    },

    power_source: {
        title: "Power Source",
        description: "What fuels your abilities?",
        segments: [
            { text: "Inner Chi", value: "inner_chi", fillStyle: "#FF6B6B", power: 600 },
            { text: "Arcane Magic", value: "arcane_magic", fillStyle: "#4ECDC4", power: 650 },
            { text: "Divine Energy", value: "divine_energy", fillStyle: "#45B7D1", power: 700 },
            { text: "Dark Arts", value: "dark_arts", fillStyle: "#96CEB4", power: 680 },
            { text: "Technology", value: "technology", fillStyle: "#FFEAA7", power: 550 },
            { text: "Elemental Force", value: "elemental_force", fillStyle: "#DDA0DD", power: 620 },
            { text: "Psychic Power", value: "psychic_power", fillStyle: "#98D8C8", power: 640 },
            { text: "Cosmic Energy", value: "cosmic_energy", fillStyle: "#F7DC6F", power: 750 }
        ]
    },

    primary_ability: {
        title: "Primary Ability",
        description: "Your signature power!",
        segments: [
            { text: "Super Strength", value: "super_strength", fillStyle: "#FF6B6B", power: 800 },
            { text: "Time Control", value: "time_control", fillStyle: "#4ECDC4", power: 950 },
            { text: "Mind Reading", value: "mind_reading", fillStyle: "#45B7D1", power: 700 },
            { text: "Invisibility", value: "invisibility", fillStyle: "#96CEB4", power: 650 },
            { text: "Teleportation", value: "teleportation", fillStyle: "#FFEAA7", power: 750 },
            { text: "Energy Blasts", value: "energy_blasts", fillStyle: "#DDA0DD", power: 800 },
            { text: "Shape Shifting", value: "shape_shifting", fillStyle: "#98D8C8", power: 720 },
            { text: "Reality Warping", value: "reality_warping", fillStyle: "#F7DC6F", power: 1000 }
        ]
    },

    weakness: {
        title: "Fatal Weakness",
        description: "Every hero has an Achilles heel...",
        segments: [
            { text: "Overconfidence", value: "overconfidence", fillStyle: "#FF6B6B", power: -200 },
            { text: "Kryptonite", value: "kryptonite", fillStyle: "#4ECDC4", power: -300 },
            { text: "Water", value: "water", fillStyle: "#45B7D1", power: -150 },
            { text: "Silver", value: "silver", fillStyle: "#96CEB4", power: -180 },
            { text: "Sunlight", value: "sunlight", fillStyle: "#FFEAA7", power: -220 },
            { text: "Iron", value: "iron", fillStyle: "#DDA0DD", power: -160 },
            { text: "Loud Noises", value: "loud_noises", fillStyle: "#98D8C8", power: -120 },
            { text: "Magic Circles", value: "magic_circles", fillStyle: "#F7DC6F", power: -250 }
        ]
    },

    personality_trait: {
        title: "Personality Trait",
        description: "What defines your character?",
        segments: [
            { text: "Brave", value: "brave", fillStyle: "#FF6B6B", power: 300, alignment: "hero" },
            { text: "Cunning", value: "cunning", fillStyle: "#4ECDC4", power: 250, alignment: "anti-hero" },
            { text: "Ruthless", value: "ruthless", fillStyle: "#45B7D1", power: 280, alignment: "villain" },
            { text: "Compassionate", value: "compassionate", fillStyle: "#96CEB4", power: 320, alignment: "hero" },
            { text: "Mysterious", value: "mysterious", fillStyle: "#FFEAA7", power: 260, alignment: "anti-hero" },
            { text: "Ambitious", value: "ambitious", fillStyle: "#DDA0DD", power: 290, alignment: "villain" },
            { text: "Loyal", value: "loyal", fillStyle: "#98D8C8", power: 310, alignment: "hero" },
            { text: "Chaotic", value: "chaotic", fillStyle: "#F7DC6F", power: 270, alignment: "anti-hero" }
        ]
    },

    moral_alignment: {
        title: "Moral Alignment",
        description: "Where do you stand in the eternal battle?",
        segments: [
            { text: "Lawful Good", value: "lawful_good", fillStyle: "#FFD700", power: 400, type: "hero" },
            { text: "Chaotic Good", value: "chaotic_good", fillStyle: "#87CEEB", power: 350, type: "hero" },
            { text: "True Neutral", value: "true_neutral", fillStyle: "#DDA0DD", power: 300, type: "anti-hero" },
            { text: "Chaotic Neutral", value: "chaotic_neutral", fillStyle: "#F0E68C", power: 320, type: "anti-hero" },
            { text: "Lawful Evil", value: "lawful_evil", fillStyle: "#DC143C", power: 380, type: "villain" },
            { text: "Neutral Evil", value: "neutral_evil", fillStyle: "#8B0000", power: 360, type: "villain" },
            { text: "Chaotic Evil", value: "chaotic_evil", fillStyle: "#4B0082", power: 400, type: "villain" },
            { text: "Lawful Neutral", value: "lawful_neutral", fillStyle: "#B0C4DE", power: 280, type: "anti-hero" }
        ]
    },

    // THE CRUCIAL 8TH SPIN - Pet Redemption with 90% NO, 10% Pet Bonus
    pet_redemption: {
        title: "Pet Redemption",
        description: "A rare companion may join your quest...",
        segments: [
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "NO", value: "no_pet", fillStyle: "#696969", power: 0 },
            { text: "PET BONUS!", value: "pet_available", fillStyle: "#FFD700", power: 500 }
        ]
    }
};

// Pet options available when player hits the 10% pet bonus
export const PET_OPTIONS = [
    { name: "Dragon Hatchling", power: 800, type: "combat", rarity: "legendary" },
    { name: "Phoenix Companion", power: 750, type: "support", rarity: "epic" },
    { name: "Shadow Wolf", power: 650, type: "stealth", rarity: "rare" },
    { name: "Crystal Unicorn", power: 700, type: "healing", rarity: "epic" },
    { name: "Thunder Eagle", power: 600, type: "speed", rarity: "rare" },
    { name: "Cosmic Cat", power: 900, type: "cosmic", rarity: "legendary" },
    { name: "Fire Salamander", power: 550, type: "elemental", rarity: "uncommon" },
    { name: "Spirit Fox", power: 680, type: "magic", rarity: "rare" }
];

export const CHARACTER_TYPES = {
    HERO: "hero",
    ANTI_HERO: "anti-hero",
    VILLAIN: "villain"
};

export const POWER_TIERS = {
    SSS: { min: 9000, max: 15000, label: "Cosmic God", color: "#FF1493" },
    SS: { min: 7500, max: 8999, label: "Divine Being", color: "#FFD700" },
    S: { min: 6000, max: 7499, label: "Legendary Hero", color: "#FF6347" },
    A: { min: 4500, max: 5999, label: "Elite Champion", color: "#32CD32" },
    B: { min: 3000, max: 4499, label: "Skilled Warrior", color: "#4169E1" },
    C: { min: 2000, max: 2999, label: "Competent Fighter", color: "#9370DB" },
    D: { min: 1000, max: 1999, label: "Novice Adventurer", color: "#20B2AA" },
    E: { min: 0, max: 999, label: "Beginner", color: "#808080" }
};

// Function to calculate total character power
export function calculateCharacterPower(traits) {
    let totalPower = 0;

    Object.values(traits).forEach(trait => {
        if (trait && trait.power) {
            totalPower += trait.power;
        }
    });

    return Math.max(0, totalPower); // Ensure non-negative
}

// Function to determine character type from traits
export function determineCharacterType(traits) {
    const alignment = traits.moral_alignment;
    const personality = traits.personality_trait;

    // Primary determination from moral alignment
    if (alignment && alignment.type) {
        return alignment.type;
    }

    // Secondary determination from personality
    if (personality && personality.alignment) {
        return personality.alignment;
    }

    // Default fallback
    return CHARACTER_TYPES.ANTI_HERO;
}