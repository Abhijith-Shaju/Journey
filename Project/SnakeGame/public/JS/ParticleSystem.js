class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    explode(x, y, color) {
        // Create 20 little squares
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2, // Pixel coordinates
                y: y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                vx: (Math.random() - 0.5) * 10, // Random velocity X
                vy: (Math.random() - 0.5) * 10, // Random velocity Y
                life: 1.0, // 100% opacity
                color: color
            });
        }
    }

    update() {
        // Move and fade particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05; // Fade out speed

            if (p.life <= 0) this.particles.splice(i, 1); // Remove dead particles
        }
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
        });
        ctx.globalAlpha = 1.0; // Reset opacity
    }
}