import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface PerlinSketchProps {
  onRegenerate?: () => void;
  shouldRegenerate?: boolean;
}

const PerlinSketch = ({ onRegenerate, shouldRegenerate }: PerlinSketchProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const particles = useRef<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

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

  useEffect(() => {
    if (shouldRegenerate && p5Instance.current) {
      console.log('Regenerating sketch');
      const p = p5Instance.current;
      p.background(255);

      if (particles.current) {
        particles.current.forEach(particle => {
          particle.x = p.random(p.width);
          particle.y = p.random(p.height);
          particle.prev_x = particle.x;
          particle.prev_y = particle.y;
          particle.life = p.random(20, 100);
        });
      }

      p.loop();
      setIsAnimating(true);
      onRegenerate?.();
    }
  }, [shouldRegenerate, onRegenerate]);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      class Particle {
        x: number;
        y: number;
        prev_x: number;
        prev_y: number;
        speed: number;
        life: number;

        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.prev_x = this.x;
          this.prev_y = this.y;
          this.speed = 2;
          this.life = p.random(20, 100);
        }

        update() {
          this.prev_x = this.x;
          this.prev_y = this.y;
          let angle = p.noise(this.x * 0.002, this.y * 0.002) * p.TWO_PI * 4;
          this.x += p.cos(angle) * this.speed;
          this.y += p.sin(angle) * this.speed;
          this.life--;
          if (this.life < 0 || this.x < 0 || this.x > p.width || this.y < 0 || this.y > p.height) {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.prev_x = this.x;
            this.prev_y = this.y;
            this.life = p.random(20, 100);
          }
        }

        draw() {
          p.stroke(0, 255);
          p.strokeWeight(0.3);
          p.line(this.prev_x, this.prev_y, this.x, this.y);
        }
      }

      p.setup = () => {
        console.log('Setup called');
        const container = sketchRef.current?.parentElement;
        const width = container ? Math.min(container.clientWidth - 32, 800) : 800;
        const height = width;
        
        p.createCanvas(width, height);
        p.background(255);
        
        particles.current = [new Particle()];
        console.log('Initial particle created');
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
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={sketchRef} className="flex justify-center"></div>
      <div className="mt-8 mb-4 flex gap-4 justify-center">
        <button
          onClick={() => {
            console.log('Generate button clicked');
            if (p5Instance.current) {
              const p = p5Instance.current;
              p.background(255);
              if (particles.current) {
                particles.current.forEach(particle => {
                  particle.x = p.random(p.width);
                  particle.y = p.random(p.height);
                  particle.prev_x = particle.x;
                  particle.prev_y = particle.y;
                  particle.life = p.random(20, 100);
                });
              }
              p.loop();
              setIsAnimating(true);
            }
          }}
          className="w-28 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-lg font-medium"
        >
          Reset
        </button>
        <button
          onClick={handlePauseResume}
          className={`w-28 px-6 py-3 text-white rounded-full transition-colors text-lg font-medium ${
            isAnimating
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isAnimating ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
};

export default PerlinSketch;
