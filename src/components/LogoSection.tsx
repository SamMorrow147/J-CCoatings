"use client";

import { useState, useEffect } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';
import BlurText from './BlurText';

export default function LogoSection() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL2 support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.warn('WebGL2 not supported, falling back to regular logo');
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    async function loadLogoImage() {
      try {
        console.log('Starting to load logo image...');
        const response = await fetch('/logo-metallic.svg');
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log('Blob created:', blob.type, blob.size);
        
        const file = new File([blob], "logo-metallic.svg", { type: blob.type });
        console.log('File created:', file.name, file.type);

        const parsedData = await parseLogoImage(file);
        console.log('Parsed data:', parsedData);
        
        setImageData(parsedData?.imageData ?? null);
        setLoading(false);

      } catch (err) {
        console.error("Error loading logo image:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    if (webglSupported) {
      loadLogoImage();
    }
  }, [webglSupported]);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Half - Text Content */}
          <div className="w-full lg:w-1/2">
            <BlurText
              text="Crafting Digital Excellence"
              delay={150}
              animateBy="words"
              direction="top"
              as="h2"
              className="text-5xl font-bold text-white mb-6"
              threshold={0.1}
              rootMargin="0px 0px -10% 0px"
              animationFrom={{ filter: "blur(10px)", opacity: 0, y: -20 }}
              animationTo={[{ filter: "blur(0px)", opacity: 1, y: 0 }]}
            />
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                At Forward Minded Media, we believe in pushing the boundaries of what's possible. 
                Our innovative approach combines cutting-edge technology with creative vision to 
                deliver exceptional results that drive your business forward.
              </p>
              
              <p>
                From strategic planning to flawless execution, we're your partners in digital 
                transformation. Every project is an opportunity to create something extraordinary 
                that resonates with your audience and achieves your goals.
              </p>
              
              <p>
                Ready to take your brand to the next level? Let's create something amazing together.
              </p>
            </div>
            
            <div className="mt-8">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Your Project
              </button>
            </div>
          </div>
          
          {/* Right Half - Metallic Logo */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-96 h-96 relative">
              {error ? (
                <div className="w-full h-full bg-red-100 rounded-lg flex items-center justify-center flex-col">
                  <span className="text-red-600 text-center">Error loading logo:</span>
                  <span className="text-red-500 text-sm mt-2">{error}</span>
                </div>
              ) : loading ? (
                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-gray-500">Loading logo...</span>
                </div>
              ) : !webglSupported ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src="/logo.svg" 
                    alt="Forward Minded Media Logo" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
              ) : imageData ? (
                <MetallicPaint 
                  imageData={imageData} 
                  params={{ 
                    edge: 0.2, 
                    patternBlur: 0.01, 
                    patternScale: 1.5, 
                    refraction: 0.05, 
                    speed: 0.5, 
                    liquid: 0.15 
                  }} 
                />
              ) : (
                <div className="w-full h-full bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600">No image data available</span>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
