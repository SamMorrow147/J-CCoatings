"use client";

import TrueFocus from "./TrueFocus";

export default function TrueFocusSection() {
  return (
    <section className="pt-16 pb-0 bg-white flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row">
        {/* Text Content - Full width on mobile, left column on desktop */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end md:pr-12 mb-8 md:mb-0">
          <div className="text-center md:text-right max-w-lg">
            <div className="text-black">
              <TrueFocus 
                sentence="Focus Forward"
                manualMode={false}
                blurAmount={5}
                borderColor="#864280"
                glowColor="rgba(134, 66, 128, 0.6)"
                animationDuration={0.75}
                pauseBetweenAnimations={0.4}
              />
            </div>
            <p className="text-gray-600 text-lg mt-8 leading-relaxed">
              Our focus is clear: delivering results that matter. Every strategy, every campaign, 
              every partnership is designed with one goal in mind - your success.
            </p>
          </div>
        </div>
        
        {/* Focus Image - Full width on mobile, right column on desktop */}
        <div className="w-full md:w-1/2 flex flex-col justify-end md:pl-12">
          <div className="w-full h-64 md:h-96">
            <img 
              src="/Focus-Image.png" 
              alt="Focus Forward - Visual representation" 
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
