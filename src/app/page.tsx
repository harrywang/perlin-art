'use client';

import dynamic from 'next/dynamic';

// Disable SSR for p5.js component
const PerlinSketch = dynamic(() => import('@/components/PerlinSketch'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-[800px]">
        <h1 className="text-3xl font-bold text-zinc-700 mb-4 text-center px-4">Perlin Noise Art</h1>
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <PerlinSketch numParticles={10000} />
        </div>
      </div>
    </main>
  );
}
