'use client';

import dynamic from 'next/dynamic';

const PerlinSketch = dynamic(() => import('@/components/PerlinSketch'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Perlin Noise Art Generator</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <PerlinSketch />
      </div>
    </main>
  );
}
