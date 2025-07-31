'use client';

import { useEffect, useState, useRef } from 'react';

export default function GameScreen() {
    const wheelRef = useRef(null);
    const [wheel, setWheel] = useState(null);
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (window.Winwheel && window.TweenMax) {
            const myWheel = new window.Winwheel({
                canvasId: 'wheel-canvas',
                numSegments: 8,
                outerRadius: 200,
                textFontSize: 16,
                segments: [
                    { fillStyle: '#eae56f', text: 'Option 1' },
                    { fillStyle: '#89f26e', text: 'Option 2' },
                    { fillStyle: '#7de6ef', text: 'Option 3' },
                    { fillStyle: '#e7706f', text: 'Option 4' },
                    { fillStyle: '#eae56f', text: 'Option 5' },
                    { fillStyle: '#89f26e', text: 'Option 6' },
                    { fillStyle: '#7de6ef', text: 'Option 7' },
                    { fillStyle: '#e7706f', text: 'Option 8' },
                ],
                animation: {
                    type: 'spinToStop',
                    duration: 4,
                    spins: 8,
                    callbackFinished: () => {
                        const stopAngle = wheel.wheelSpinStopAngle; // in degrees
                        const segmentIndex = Math.floor(((stopAngle + 360) % 360) / (360 / wheel.numSegments));
                        alert(`Stopped at segment: ${segmentIndex}`);
                        setSpinning(false);
                        // Show results or trigger next steps

                    },
                    soundTrigger: 'pin', // Optional: add sound on pin hit

                },
            });
            setWheel(myWheel);

        }
    }, []);

    const handleSpin = () => {
        if (wheel && !spinning) {
            setSpinning(true);
            wheel.startAnimation();
            // Optional: add sound effect here
            // Example: play sound when spin starts
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <canvas
                id="wheel-canvas"
                width="400"
                height="400"
                className="border-4 border-white rounded-full mb-8"
            />
            <div className="relative">
                <canvas id="wheel-canvas" width="400" height="400" />
                {/* Needle pointer */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-18 bg-red-600 absolute -top-16 left-1/2 transform -translate-x-1/2" />
                </div>
            </div>

            <button
                onClick={handleSpin}
                disabled={spinning}
                className={`px-8 py-4 text-xl font-bold rounded-lg ${
                    spinning ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {spinning ? 'Spinning...' : 'SPIN!'}
            </button>
        </div>
    );
}
