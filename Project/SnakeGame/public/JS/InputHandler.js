/**
 * ==========================================
 * INPUT HANDLER
 * ==========================================
 * Manages keyboard input using e.code for layout independence.
 */
class InputHandler {
    constructor() {
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        document.addEventListener('keydown', (e) => this.handleKey(e));
    }

    handleKey(e) {
        // Stop if locked (Sabotaged)
        if (this.inputLocked) return;
        
        // Prevent default scrolling behavior for arrow keys
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }

        const currentDir = this.direction;

        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                if (currentDir.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                if (currentDir.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (currentDir.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (currentDir.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
        }
    }

    update() {
        this.direction = this.nextDirection;
    }
}