// src/lib/gameData.js

export const gameData = {
    redemptionPets: [
        {"name": "Wise Owl", "description": "Provides cryptic but helpful advice", "type": "guidance"},
        {"name": "Loyal Dog", "description": "Never abandons you in dark times", "type": "loyalty"},
        {"name": "Mystical Cat", "description": "Sees through illusions and lies", "type": "insight"},
        {"name": "Guardian Spirit", "description": "Protects against spiritual threats", "type": "protection"},
        {"name": "Talking Raven", "description": "Messenger between worlds", "type": "communication"},
        {"name": "Ancient Turtle", "description": "Grants patience and wisdom", "type": "wisdom"},
        {"name": "Phoenix Chick", "description": "Symbolizes rebirth and hope", "type": "renewal"},
        {"name": "Spirit Guide", "description": "Shows the path to redemption", "type": "guidance"}
    ],

    categories: {
        "species": {
            "name": "Species",
            "strong": ["Dragon", "Angel", "Vampire Lord", "Demon Prince", "Divine Being", "Phoenix", "Celestial", "Ancient Elf", "Titan", "Primordial"],
            "weak": ["Fairy", "Goblin", "Regular Human", "Halfling", "Garden Gnome", "House Cat", "Anxious Ghost", "Clumsy Dwarf", "Sleepy Sloth", "Confused Squirrel"]
        },
        "powers": {
            "name": "Powers",
            "strong": ["Telekinesis", "Elemental Manipulation", "Reality Warping", "Immortality", "Super Strength", "Time Control", "Energy Absorption", "Mind Control", "Shapeshifting", "Omniscience"],
            "weak": ["Can only turn into a teacup", "Grows flowers on demand (only daisies)", "Can only levitate small crumbs", "Ability to remember every sock lost", "Communicates only through interpretive dance", "Super sensitive to loud noises", "Can change hair color at will (only to neon green)", "Ability to perfectly fold laundry", "Can summon a single, very confused pigeon", "Always knows the exact temperature of lukewarm water"]
        },
        "weaknesses": {
            "name": "Weaknesses",
            "strong": ["Kryptonite (specific to your species/powers)", "Vulnerability to sunlight", "Existential dread", "Can't resist shiny objects", "Loves bad puns too much", "Ticklish everywhere", "Always gets lost, even with a map", "Allergic to heroic speeches", "Has a phobia of doorknobs", "Constantly forgets names"],
            "weak": ["Mild discomfort from loud chewing", "Dislikes Mondays", "Occasionally misplaces keys", "Thinks cilantro tastes like soap", "Gets sleepy after big meals", "Has a slight fear of heights (only really tall ladders)", "Can't parallel park", "Forgets to water plants sometimes", "Has a messy desk", "Sings slightly off-key in the shower"]
        },
        "origin": {
            "name": "Origin",
            "strong": ["Ancient Prophecy", "Cosmic Anomaly", "Divine Intervention", "Secret Government Experiment", "Born from a Dying Star", "Found in a Lost Dimension", "Awakened from Millennia of Slumber", "Forged in the Heart of a Volcano", "Descendant of Legendary Heroes", "Created by a Mad God"],
            "weak": ["Fell out of a tree", "Found under a rock", "Was a misplaced package", "Accidentally cloned from a dust bunny", "Woke up in a ditch with amnesia", "Originated from a very bland office building", "Appeared after a bad burrito", "Spawned from a spilled coffee cup", "Came from a very enthusiastic fan fiction", "Was a typo in a creation spell"]
        },
        "personality": {
            "name": "Personality",
            "strong": ["Fearless Leader", "Wise & Calm", "Charismatic & Inspiring", "Ruthless Strategist", "Mysterious & Alluring", "Noble & Selfless", "Unyielding & Resilient", "Brilliant & Innovative", "Playful & Mischievous (but deadly)", "Stoic & Unwavering"],
            "weak": ["Constantly second-guesses themselves", "Overly dramatic", "Easily distracted by butterflies", "Speaks only in riddles (bad ones)", "Obsessed with collecting spoons", "Always apologizes, even when not at fault", "Has an inexplicable fear of small talk", "Believes everything is a conspiracy", "Cannot tell a lie (even white lies)", "Gets anxious in crowds"]
        },
        "weakness_response": {
            "name": "Weakness Response",
            "strong": ["Overcomes with sheer will", "Finds an unexpected loophole", "Turns weakness into a strength", "Gets help from a powerful ally", "Learns a new skill to mitigate it", "It's a temporary setback", "Outsmarts the limitation", "Finds a magical artifact to negate it", "Accepts and finds peace with it", "It's just a phase, really"],
            "weak": ["Cries uncontrollably", "Gives up immediately", "Blames everyone else", "Goes into a deep sulk", "Hides under a blanket", "Buys too much junk food", "Starts a very passive-aggressive blog", "Converts to a new obscure religion", "Demands a refund from destiny", "Pretends it doesn't exist"]
        },
        "redemption_path": {
            "name": "Redemption Path",
            "strong": ["Forging Alliances", "Self-Sacrifice", "Confronting Past Demons", "Mastering Inner Chi", "Becoming a Mentor", "Discovering Hidden Truths", "Upholding Justice", "Acts of Unconditional Kindness", "Protecting the Innocent", "Embracing Humility"],
            "weak": ["Apologizing profusely (and insincerely)", "Writing a strongly worded letter", "Joining a support group (then leaving)", "Doing a minor good deed once a year", "Donating to charity (using someone else's money)", "Attempting to bake a cake for redemption (it burns)", "Muttering vague apologies to strangers", "Thinking about being good, but not doing it", "Redecorating their lair with 'positive vibes'", "Hoping someone else fixes it"]
        },
        // NEW: Pet Redemption Spin (8th spin)
        "pet_redemption": {
            "name": "Pet Redemption Bonus",
            "strong": ["Pet Bonus Available!"], // Only 1 strong option (10% chance)
            "weak": ["NO", "NO", "NO", "NO", "NO", "NO", "NO", "NO", "NO"] // 9 weak "NO" options (90% chance)
        }
    },

    commentary: {
        spinStart: [
            "Prepare for the inevitable!", "Destiny awaits... or at least a random outcome.", "The wheel turns, as does your stomach.", "May the odds be... whatever the wheel decides.", "Brace yourself for impact!"
        ],
        spinEnd: {
            strong: [
                "A powerful choice! The universe approves.", "Magnificent! Your legend grows.", "Truly a trait of champions!", "An excellent twist of fate!", "Destiny smiles upon you!"
            ],
            weak: [
                "Oh dear. That's... something.", "Well, it could be worse. Maybe.", "The universe has a strange sense of humor.", "An unexpected turn, to say the least.", "Perhaps 'unique' is the right word."
            ]
        },
        // NEW: Pet redemption specific commentary
        petRedemption: {
            petAvailable: [
                "A mystical companion awaits! Choose wisely...", "The universe offers you a loyal friend!", "A pet bonus has appeared! This is rare indeed!", "Your journey need not be alone after all!", "Fate smiles upon you with companionship!"
            ],
            noPet: [
                "The path of solitude calls to you.", "No pet for you - independence is your strength.", "You walk alone, as many heroes do.", "Self-reliance is its own form of power.", "The lone wolf approach it is!"
            ]
        },
        final: {
            overpowered: [
                "Behold, a legend walks among us! The very fabric of reality trembles.", "A true force of nature! Even the gods are taking notes.", "Unstoppable! You're basically a walking cheat code.", "So powerful, it's almost unfair. Almost.", "The epitome of greatness. Now go save the multiverse or something."
            ],
            creative: [
                "What an eclectic mix! You're certainly one-of-a-kind.", "An artistic masterpiece of fate!", "Truly outside the box. Who needs norms?", "The universe's most interesting character, hands down.", "A tapestry of destiny, woven with unexpected threads."
            ],
            comedy: [
                "Hilarious! The cosmic joke has found its punchline.", "You're a walking sitcom, and we're all watching.", "The funniest character the universe has ever seen. Bravo!", "Prepare for side-splitting adventures!", "Your destiny is to make everyone laugh. Mission accomplished."
            ],
            redemption: [
                "The path to redemption is clear! A true triumph of spirit.", "From darkness to light, a beautiful journey.", "The cosmos celebrates your newfound virtue!", "A story of hope and transformation.", "Redeemed! Now go do some good in the world."
            ]
        }
    }
};