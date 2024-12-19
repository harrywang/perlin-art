'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';

const PerlinSketch = dynamic(() => import('@/components/PerlinSketch'), {
  ssr: false
});

export default function Home() {
  const sketchRef = useRef<{ regenerateSketch: () => void } | null>(null);

  const handleRegenerate = () => {
    sketchRef.current?.regenerateSketch();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-[800px]">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center px-4">Perlin Noise Art Generator</h1>
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <PerlinSketch ref={sketchRef} />
        </div>
        <div className="mt-8 mb-4">
          <button 
            onClick={handleRegenerate}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-lg font-medium"
          >
            Generate New
          </button>
        </div>
      </div>
    </main>
  );
}
