let particles = [];
const numParticles = 10000;
const noiseScale = 0.002;
let canvas;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.prev_x = this.x;
        this.prev_y = this.y;
        this.speed = 2;
        this.life = random(20, 100);
    }

    update() {
        this.prev_x = this.x;
        this.prev_y = this.y;

        let angle = noise(this.x * noiseScale, this.y * noiseScale) * TWO_PI * 4;
        this.x += cos(angle) * this.speed;
        this.y += sin(angle) * this.speed;

        this.life--;
        
        // Reset particle if it's dead or out of bounds
        if (this.life < 0 || 
            this.x < 0 || this.x > width || 
            this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        stroke(0, 10);
        strokeWeight(0.3);
        line(this.prev_x, this.prev_y, this.x, this.y);
    }
}

function setup() {
    canvas = createCanvas(800, 800);
    background(255);
    
    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    
    window.generateNew = () => {
        noiseSeed(random(10000));
        background(255);
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    };
}

function draw() {
    // No background refresh for trail effect
    noFill();
    
    for (let p of particles) {
        p.update();
        p.draw();
    }
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        generateNew();
    }
}

function saveSVG() {
    save(canvas, 'perlin_noise_art.svg');
}
