import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

class Particle {
  x: number;
  y: number;
  prev_x: number;
  prev_y: number;
  speed: number;
  life: number;
  p: p5;
  opacity: number;
  weight: number;

  constructor(p: p5, opacity: number, weight: number) {
    this.p = p;
    this.x = 0;  
    this.y = 0;
    this.prev_x = 0;
    this.prev_y = 0;
    this.speed = 2;
    this.life = p.random(20, 100);
    this.opacity = opacity;
    this.weight = weight;
  }

  update() {
    this.prev_x = this.x;
    this.prev_y = this.y;
    let angle = this.p.noise(this.x * 0.002, this.y * 0.002) * this.p.TWO_PI * 4;
    this.x += this.p.cos(angle) * this.speed;
    this.y += this.p.sin(angle) * this.speed;
    this.life--;
    if (this.life < 0 || this.x < 0 || this.x > this.p.width || this.y < 0 || this.y > this.p.height) {
      this.x = this.p.random(this.p.width);
      this.y = this.p.random(this.p.height);
      this.prev_x = this.x;
      this.prev_y = this.y;
      this.life = this.p.random(20, 100);
    }
  }

  draw() {
    this.p.stroke(0, this.opacity);
    this.p.strokeWeight(this.weight);
    this.p.line(this.prev_x, this.prev_y, this.x, this.y);
  }
}

interface PerlinSketchProps {
  onRegenerate?: () => void;
  shouldRegenerate?: boolean;
  numParticles?: number;
}

const PerlinSketch = ({ onRegenerate, shouldRegenerate, numParticles = 10000 }: PerlinSketchProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const particles = useRef<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [particleCount, setParticleCount] = useState(numParticles);
  const [opacity, setOpacity] = useState(10);
  const [strokeWeight, setStrokeWeight] = useState(0.3);

  // Reset sketch with new random seed
  const resetSketch = () => {
    console.log('Resetting sketch');
    if (p5Instance.current) {
      p5Instance.current.remove();
    }
    
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setup called');
        // Set a new random seed
        const seed = Math.floor(Math.random() * 1000000);
        p.randomSeed(seed);
        p.noiseSeed(seed);
        console.log('Using seed:', seed);
        
        const container = sketchRef.current?.parentElement;
        const width = container ? Math.min(container.clientWidth - 32, 800) : 800;
        const height = width;
        
        p.createCanvas(width, height);
        p.background(255);
        
        createParticles(p, particleCount);
      };

      p.draw = () => {
        particles.current.forEach(particle => {
          particle.update();
          particle.draw();
        });
      };
    };

    console.log('Creating new p5 instance');
    p5Instance.current = new p5(sketch, sketchRef.current);
    setIsAnimating(true);
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    setIsAnimating(prev => {
      const newState = !prev;
      if (p5Instance.current) {
        if (newState) {
          console.log('Resuming animation');
          p5Instance.current.loop();
        } else {
          console.log('Pausing animation');
          p5Instance.current.noLoop();
        }
      }
      return newState;
    });
  };

  // Create particles with random positions
  const createParticles = (p: p5, count: number) => {
    particles.current = Array.from({ length: count }, () => {
      const particle = new Particle(p, opacity, strokeWeight);
      particle.x = p.random(p.width);
      particle.y = p.random(p.height);
      particle.prev_x = particle.x;
      particle.prev_y = particle.y;
      return particle;
    });
    console.log(`Created ${count} particles with new random positions`);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!sketchRef.current || !p5Instance.current) return;
      
      const container = sketchRef.current.parentElement;
      if (!container) return;

      const width = Math.min(container.clientWidth - 32, 800);
      const height = width;

      console.log('Resizing canvas to:', width, height);
      p5Instance.current.resizeCanvas(width, height);
      p5Instance.current.background(255);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (shouldRegenerate && p5Instance.current) {
      console.log('Regenerating sketch');
      const p = p5Instance.current;
      p.background(255);
      createParticles(p, particleCount);
      p.loop();
      setIsAnimating(true);
      onRegenerate?.();
    }
  }, [shouldRegenerate, onRegenerate, particleCount, opacity, strokeWeight]);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setup called');
        // Set initial random seed
        const seed = Math.floor(Math.random() * 1000000);
        p.randomSeed(seed);
        p.noiseSeed(seed);
        console.log('Using initial seed:', seed);
        
        const container = sketchRef.current?.parentElement;
        const width = container ? Math.min(container.clientWidth - 32, 800) : 800;
        const height = width;
        
        p.createCanvas(width, height);
        p.background(255);
        
        createParticles(p, particleCount);
      };

      p.draw = () => {
        particles.current.forEach(particle => {
          particle.update();
          particle.draw();
        });
      };
    };

    console.log('Creating p5');
    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      if (p5Instance.current) {
        console.log('Cleaning up p5 instance');
        p5Instance.current.remove();
      }
    };
  }, []); // Only run once on mount

  return (
    <div className="w-full">
      <div ref={sketchRef} className="flex justify-center w-full max-w-full overflow-hidden"></div>
      <div className="mt-4 md:mt-8 mb-2 md:mb-4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <p className="text-base text-zinc-600 dark:text-zinc-400 group relative cursor-help">
              Particles:
              <span className="invisible group-hover:visible absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                Number of particles to draw. More particles create denser patterns but may affect performance.
              </span>
            </p>
            <input
              id="particleCount"
              type="number"
              min="1"
              max="50000"
              value={particleCount}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 1;
                setParticleCount(Math.max(1, Math.min(50000, newValue)));
              }}
              className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-shadow duration-200 text-gray-900 dark:text-gray-100"
              title="Enter a number between 1 and 50000"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-base text-zinc-600 dark:text-zinc-400 group relative cursor-help">
              Opacity:
              <span className="invisible group-hover:visible absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                Controls how transparent the lines are. Lower values create more subtle, layered effects.
              </span>
            </p>
            <input
              id="opacity"
              type="number"
              min="1"
              max="255"
              value={opacity}
              onChange={(e) => {
                const newValue = parseInt(e.target.value) || 1;
                setOpacity(Math.max(1, Math.min(255, newValue)));
              }}
              className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-shadow duration-200 text-gray-900 dark:text-gray-100"
              title="Enter a number between 1 and 255"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-base text-zinc-600 dark:text-zinc-400 group relative cursor-help">
              Weight:
              <span className="invisible group-hover:visible absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                Controls the thickness of the lines. Lower values create finer, more delicate patterns.
              </span>
            </p>
            <input
              id="strokeWeight"
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={strokeWeight}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value) || 0.1;
                setStrokeWeight(Math.max(0.1, Math.min(5, newValue)));
              }}
              className="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-shadow duration-200 text-gray-900 dark:text-gray-100"
              title="Enter a number between 0.1 and 5"
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-3 md:gap-4">
          <button
            onClick={resetSketch}
            className="w-28 px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-base md:text-lg font-medium"
          >
            Reset
          </button>
          <button
            onClick={handlePauseResume}
            className={`w-28 px-4 md:px-6 py-2 md:py-3 text-white rounded-full transition-colors text-base md:text-lg font-medium ${
              isAnimating
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAnimating ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerlinSketch;
