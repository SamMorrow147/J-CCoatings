"use client";

import LiquidEther from "./LiquidEther";
import SplitText from "./SplitText";

export default function Header() {
  return (
    <div className="relative h-[85vh] w-full bg-black">
      {/* Solid black background - using bg-black on the container itself */}
      
      {/* Custom blue background layer behind interactive effect */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: '#236292' }}></div>
      
      {/* Liquid Ether effect layer - now on top but behind text */}
      <div className="absolute inset-0 z-10 animate-fade-in-background">
        <LiquidEther 
          resolution={0.4} 
          isBounce={true} 
          colors={['#66b6ff', '#b8ea68']}
        />
      </div>
      
          {/* Content layer - with pointer-events-none to allow mouse through */}
          <header className="relative z-20 flex items-center justify-center h-full pointer-events-none">
            <div className="text-center">
              <SplitText
                text="We Go Hard in the Motherfucking Paint"
                tag="h1"
                className="text-white text-6xl font-bold pointer-events-auto mb-4"
                delay={75}
                duration={0.4}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="center"
                immediate={true}
                startDelay={0.8}
                onLetterAnimationComplete={() => {}}
              />
              <p className="text-white/80 text-xl font-light tracking-wide opacity-0 animate-fade-in-delayed mb-8" style={{ fontFamily: '"halcom", sans-serif', fontWeight: 400, fontStyle: 'normal' }}>
                Professional painting services with attitude.
              </p>
              
              {/* Glassmorphism Let's Go Button */}
              <div className="opacity-0 animate-fade-in-button">
                <button className="glass-button pointer-events-auto">
                  Let&apos;s Go!
                </button>
              </div>
              
              <style jsx>{`
                @keyframes fadeInBackground {
                  0% {
                    opacity: 0;
                  }
                  100% {
                    opacity: 1;
                  }
                }
                
                .animate-fade-in-background {
                  opacity: 0;
                  animation: fadeInBackground 0.6s ease-out 0.2s forwards;
                }
                
                @keyframes fadeInDelayed {
                  0% {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  100% {
                    opacity: 0.8;
                    transform: translateY(0);
                  }
                }
                
                .animate-fade-in-delayed {
                  animation: fadeInDelayed 0.8s ease-out 1.2s forwards;
                }
                
                @keyframes fadeInButton {
                  0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }
                
                .animate-fade-in-button {
                  animation: fadeInButton 1s ease-out 2s forwards;
                }
                
                .glass-button {
                  width: 160px;
                  height: 60px;
                  font-family: "proxima-nova", sans-serif;
                  font-weight: 800;
                  font-size: 18px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #fff;
                  background: rgba(255, 255, 255, 0.15);
                  backdrop-filter: blur(10px);
                  border: 2px solid rgba(255, 255, 255, 0.2);
                  border-radius: 16px;
                  cursor: pointer;
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  position: relative;
                  overflow: hidden;
                  z-index: 1;
                }
                
                .glass-button::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                  transition: left 0.6s ease;
                }
                
                .glass-button::after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  transition: all 0.5s ease;
                  z-index: -1;
                }
                
                .glass-button:hover {
                  background: rgba(255, 255, 255, 0.25);
                  border-color: rgba(255, 255, 255, 0.4);
                  transform: translateY(-3px) scale(1.05);
                  box-shadow: 
                    0 10px 40px rgba(255, 255, 255, 0.15),
                    0 0 20px rgba(255, 255, 255, 0.1);
                  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                }
                
                .glass-button:hover::before {
                  left: 100%;
                }
                
                .glass-button:hover::after {
                  width: 300px;
                  height: 300px;
                }
                
                .glass-button:active {
                  transform: translateY(-1px) scale(1.02);
                  background: rgba(255, 255, 255, 0.3);
                  box-shadow: 
                    0 5px 20px rgba(255, 255, 255, 0.2),
                    0 0 15px rgba(255, 255, 255, 0.15);
                }
              `}</style>
            </div>
          </header>
    </div>
  );
}
