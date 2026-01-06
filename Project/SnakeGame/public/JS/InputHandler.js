/**
 * ==========================================
 * INPUT HANDLER
 * ==========================================
 * Manages keyboard input using e.code for layout independence.
 */
class InputHandler {
    constructor() {
        this.direction = { x: 1, y: 0 }; // The direction actively moving the snake
        this.queue = [];                 // The buffer of future moves
        this.inputLocked = false; 
        this.isImmune = false;
        this.reversed = false;
        
        document.addEventListener('keydown', (e) => this.handleKey(e));
    }

    reset() {
        this.direction = { x: 1, y: 0 }; // Reset to default "Moving Right"
        this.queue = [];                 // Clear any buffered keys
    }

    handleKey(e) {
        if (this.inputLocked) return;
        
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }

        let nextMove = null;
        
        // --- REVERSE LOGIC ---
        // If reversed, we swap W/S and A/D
        const code = e.code;
        if (this.reversed) {
             if (code === 'KeyW' || code === 'ArrowUp') nextMove = { x: 0, y: 1 };        // Down
             else if (code === 'KeyS' || code === 'ArrowDown') nextMove = { x: 0, y: -1 }; // Up
             else if (code === 'KeyA' || code === 'ArrowLeft') nextMove = { x: 1, y: 0 };  // Right
             else if (code === 'KeyD' || code === 'ArrowRight') nextMove = { x: -1, y: 0 };// Left
        } else {
             // Normal Controls
             if (code === 'KeyW' || code === 'ArrowUp') nextMove = { x: 0, y: -1 };
             else if (code === 'KeyS' || code === 'ArrowDown') nextMove = { x: 0, y: 1 };
             else if (code === 'KeyA' || code === 'ArrowLeft') nextMove = { x: -1, y: 0 };
             else if (code === 'KeyD' || code === 'ArrowRight') nextMove = { x: 1, y: 0 };
        }

        if (!nextMove) return;
        // --------------------------

        const lastPlannedMove = this.queue.length > 0 ? this.queue[this.queue.length - 1] : this.direction;

        // Prevent 180 (Neck Snap)
        if (nextMove.x + lastPlannedMove.x === 0 && nextMove.y + lastPlannedMove.y === 0) return;
        if (nextMove.x === lastPlannedMove.x && nextMove.y === lastPlannedMove.y) return;

        if (this.queue.length < 2) this.queue.push(nextMove);
    }

    update() {
        // On every game tick, we grab the next move from the queue
        if (this.queue.length > 0) {
            this.direction = this.queue.shift();
        }
    }
}