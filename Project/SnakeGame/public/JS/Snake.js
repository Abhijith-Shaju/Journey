/**
 * ==========================================
 * SNAKE CLASS
 * ==========================================
 * Handles body segments, movement, and collision detection.
 */
class Snake {
    constructor() {
        this.score = 0;
        this.invincible = false;
        this.reset();
    }

    reset(startLength = 3) {
        // Ensure start length is valid
        const safeLength = Math.max(3, isNaN(startLength) ? 3 : startLength);
        this.invincible = false;
        this.alive = true;
        this.body = [];
        
        // Spawn coordinates (horizontal start)
        for (let i = 0; i < safeLength; i++) {
            this.body.push({ x: 10 - i, y: 15 });
        }
    }

    update(inputDirection) {
        if (!this.alive) return false;

        const currentHead = this.body[0];

        // PREDICT next head
        const nextHead = { 
            x: currentHead.x + inputDirection.x,
            y: currentHead.y + inputDirection.y
        };

        // WALL COLLISION
        const hitWall =
            nextHead.x < 0 ||
            nextHead.y < 0 ||
            nextHead.x >= TILE_COUNT ||
            nextHead.y >= TILE_COUNT;

        if (hitWall) {
            if (!this.invincible) {
                this.die();
            }

            // BLOCK MOVEMENT IF INVINCIBLE
            return false;
        }

        // SELF COLLISION
        for (let s of this.body) {
            if (nextHead.x === s.x && nextHead.y === s.y) {
                if (!this.invincible) {
                    this.die();
                    return false;
                }
                break; // ghost through
            }
        }

        // MOVE
        this.body.unshift(nextHead);
        return true;
    }


    die() {
        if (this.invincible) return;
        this.alive = false;
        // Penalize score (Keep 80%)
        this.score = Math.max(0, Math.floor(this.score * 0.8));
    }
}