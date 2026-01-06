class ParticleSystem {
    constructor() {
        this.pool = [];
        this.poolSize = 100; // Max 100 particles on screen at once
        
        // 1. Pre-allocate memory (The Pool)
        for (let i = 0; i < this.poolSize; i++) {
            this.pool.push({
                x: 0, y: 0,
                vx: 0, vy: 0,
                life: 0,    // 0 = Dead/Sleeping, >0 = Alive
                color: '#fff'
            });
        }
    }

    explode(x, y, color) {
        // Find 20 sleeping particles and wake them up
        let count = 0;
        for (let i = 0; i < this.poolSize; i++) {
            if (count >= 20) break; // We found enough

            const p = this.pool[i];
            
            // If particle is sleeping (life <= 0), use it!
            if (p.life <= 0) {
                p.x = x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
                p.y = y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
                p.vx = (Math.random() - 0.5) * 10;
                p.vy = (Math.random() - 0.5) * 10;
                p.life = 1.0; // Wake up!
                p.color = color;
                count++;
            }
        }
    }

    update() {
        // Loop through the fixed pool
        for (let i = 0; i < this.poolSize; i++) {
            const p = this.pool[i];
            
            // Only update active particles
            if (p.life > 0) {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05; // Fade out
                
                // If it dies, we just leave it with life <= 0.
                // It is now "sleeping" and ready to be reused.
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.poolSize; i++) {
            const p = this.pool[i];
            
            // Only draw active particles
            if (p.life > 0) {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 4, 4);
            }
        }
        ctx.globalAlpha = 1.0; // Reset opacity
    }
}