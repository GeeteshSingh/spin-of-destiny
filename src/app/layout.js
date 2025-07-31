import './globals.css';

export const metadata = {
    title: 'Spin of Destiny',
    description: 'Character Creator',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js" defer></script>
            {/* Load Winwheel.js script from public folder */}
            <script src="/Winwheel.min.js" defer></script>
        </head>
        <body className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {children}
        </body>
        </html>
    );
}
