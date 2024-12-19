import { useEffect, useRef } from 'react';
import p5 from 'p5';

const PerlinSketch = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const particles = useRef<any[]>([]);

  const regenerateSketch = () => {
    if (p5Instance.current) {
      p5Instance.current.background(255);
      if (particles.current) {
        particles.current.forEach((particle: any) => particle.reset());
      }
    }
  };

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      const numParticles = 10000;
      const noiseScale = 0.002;

      class Particle {
        x: number;
        y: number;
        prev_x: number;
        prev_y: number;
        speed: number;
        life: number;

        constructor() {
          this.reset();
        }

        reset() {
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

          let angle = p.noise(this.x * noiseScale, this.y * noiseScale) * p.TWO_PI * 4;
          this.x += p.cos(angle) * this.speed;
          this.y += p.sin(angle) * this.speed;

          this.life--;
          
          if (this.life < 0 || 
              this.x < 0 || this.x > p.width || 
              this.y < 0 || this.y > p.height) {
            this.reset();
          }
        }

        draw() {
          p.stroke(0, 10);
          p.strokeWeight(0.3);
          p.line(this.prev_x, this.prev_y, this.x, this.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(800, 800);
        p.background(255);
        
        particles.current = Array.from({ length: numParticles }, () => new Particle());
      };

      p.draw = () => {
        particles.current.forEach(particle => {
          particle.update();
          particle.draw();
        });
      };

      p.mousePressed = () => {
        p.background(255);
        particles.current.forEach(particle => particle.reset());
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div>
      <div ref={sketchRef}></div>
      <div className="flex gap-4 mt-4 justify-center">
        <button 
          onClick={regenerateSketch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Generate New
        </button>
      </div>
    </div>
  );
};

export default PerlinSketch;
