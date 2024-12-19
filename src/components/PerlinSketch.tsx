import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface PerlinSketchProps {
  onRegenerate?: () => void;
}

const PerlinSketch = ({ onRegenerate }: PerlinSketchProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const particles = useRef<any[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });

  const regenerateSketch = () => {
    if (p5Instance.current) {
      p5Instance.current.background(255);
      if (particles.current) {
        particles.current.forEach((particle: any) => particle.reset());
      }
    }
    onRegenerate?.();
  };

  const updateCanvasSize = () => {
    if (sketchRef.current && p5Instance.current) {
      const container = sketchRef.current.parentElement;
      if (container) {
        const width = Math.min(container.clientWidth - 32, 800); // subtract padding
        const height = width; // keep it square
        setCanvasSize({ width, height });
        p5Instance.current.resizeCanvas(width, height);
        p5Instance.current.background(255);
        if (particles.current) {
          particles.current.forEach((particle: any) => particle.reset());
        }
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
        const container = sketchRef.current?.parentElement;
        const width = container ? Math.min(container.clientWidth - 32, 800) : 800;
        const height = width;
        setCanvasSize({ width, height });
        
        const canvas = p.createCanvas(width, height);
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

    // Add resize listener
    const handleResize = () => {
      updateCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={sketchRef} className="flex justify-center"></div>
    </div>
  );
};

export default PerlinSketch;
