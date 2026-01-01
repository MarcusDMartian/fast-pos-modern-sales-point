
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 1500; // 1.5s
        const intervalTime = 20; // 20ms steps
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 200); // Small delay after 100%
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[10000] bg-[#FFFDF5] flex flex-col items-center justify-center overflow-hidden">
            {/* Subtle Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />

            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
                {/* Logo Container */}
                <div className="w-32 h-32 mb-10 relative group">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 group-hover:bg-primary/20 transition-all duration-1000" />
                    <div className="relative w-full h-full rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 flex items-center justify-center overflow-hidden">
                        <img
                            src="https://sv2.anhsieuviet.com/2025/12/30/image3592096a95bf966f.png"
                            alt="FastPOS Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Brand Text */}
                <h1 className="text-5xl font-black text-primary tracking-tighter mb-2 italic">
                    FastPOS
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12 ml-[0.4em]">
                    {t('splash.initializing')}
                </p>

                {/* Progress Container */}
                <div className="w-64 space-y-4 flex flex-col items-center">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-75 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                        v2.5.0
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {t('splash.powered_by')}
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
