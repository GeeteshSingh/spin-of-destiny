// src/components/WelcomeScreen.js
"use client";

export default function WelcomeScreen({ onStartGame, onViewLeaderboards }) {
    return (
        <div className="container mx-auto max-w-4xl text-center">
            <div className="welcome-content bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-200">
                <h1 className="welcome-title text-5xl md:text-6xl font-extrabold text-charcoal-800 mb-4 tracking-wide">Spin of Destiny</h1>
                <p className="welcome-subtitle text-lg md:text-xl text-gray-700 mb-6">Create your ultimate character through the power of chance</p>
                <p className="welcome-description text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Experience 7 sequential spinning wheels, redemption pets, sarcastic commentary, and leaderboards!</p>
                <div className="welcome-actions flex flex-col md:flex-row justify-center gap-4">
                    <button className="btn btn--primary bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out text-lg" onClick={onStartGame}>Begin Character Creation</button>
                    <button className="btn btn--secondary bg-transparent border-2 border-teal-400 text-teal-700 hover:bg-teal-400 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out text-lg" onClick={onViewLeaderboards}>View Leaderboards</button>
                </div>
            </div>
        </div>
    );
}