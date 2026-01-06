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
        
        document.addEventListener('keydown', (e) => this.handleKey(e));
    }

    reset() {
        this.direction = { x: 1, y: 0 }; // Reset to default "Moving Right"
        this.queue = [];                 // Clear any buffered keys
    }

    handleKey(e) {
        if (this.inputLocked) return;
        
        // Prevent default scrolling
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }

        // 1. Convert Key to Vector
        let nextMove = null;
        switch (e.code) {
            case 'KeyW': case 'ArrowUp':    nextMove = { x: 0, y: -1 }; break;
            case 'KeyS': case 'ArrowDown':  nextMove = { x: 0, y: 1 }; break;
            case 'KeyA': case 'ArrowLeft':  nextMove = { x: -1, y: 0 }; break;
            case 'KeyD': case 'ArrowRight': nextMove = { x: 1, y: 0 }; break;
            default: return; // Ignore other keys
        }

        // 2. Validation Logic (The secret sauce)
        // We validate against the LAST queued move, not the current direction.
        // This ensures the whole chain of moves is valid.
        const lastPlannedMove = this.queue.length > 0 ? this.queue[this.queue.length - 1] : this.direction;

        // Prevent 180-degree turns (e.g. going Left (-1) when planning Right (1))
        if (nextMove.x + lastPlannedMove.x === 0 && nextMove.y + lastPlannedMove.y === 0) {
            return;
        }

        // Prevent spamming the same direction (optional, but keeps queue clean)
        if (nextMove.x === lastPlannedMove.x && nextMove.y === lastPlannedMove.y) {
            return;
        }

        // 3. Add to Queue
        // We limit the queue to 2 inputs. 
        // 2 is the "Goldilocks" number: allows fast U-turns, but prevents accidental "buffering" if you mash keys.
        if (this.queue.length < 2) {
            this.queue.push(nextMove);
        }
    }

    update() {
        // On every game tick, we grab the next move from the queue
        if (this.queue.length > 0) {
            this.direction = this.queue.shift();
        }
    }
}