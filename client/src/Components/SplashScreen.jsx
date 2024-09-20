// SplashScreen.js
import logo from '../assets/Logo.gif';

const SplashScreen = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <img
                    src={logo}
                    alt="App Logo"
                    className="w-32 h-32 mx-auto"
                />
                <p className="mt-4 text-xl font-semibold text-white bg-slate-900 px-6 py-1 rounded-md">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
