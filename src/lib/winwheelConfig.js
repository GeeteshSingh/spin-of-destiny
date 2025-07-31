// src/lib/winwheelConfig.js
export const wheelOptions = {
    numSegments: 0, // Will be set dynamically
    outerRadius: 120,
    textFontSize: 14,
    segmentColors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FF8C00', '#BDB76B', '#DAA520', '#CD853F'], // Example colors
    animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 8,
        callbackFinished: null, // This will be set dynamically in the component
    }
};