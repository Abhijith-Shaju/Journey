/**
 * ==========================================
 * CONFIGURATION & CONSTANTS
 * ==========================================
 */
const CONFIG = {
    CANVAS_SIZE: 600,
    GRID_SIZE: 20,
    TICK_RATE: 12,
    
    MAX_ITEMS: 2,
    GOLD_LIFETIME: 5000,
    
    SPAWN_RATES: {
        GREEN: 0.60,
        GOLD: 0.10,
        BLUE: 0.15,
        RED: 0.15
    },
    
    SCORES: {
        GREEN: 5,
        GOLD: 15,
        BLUE: 0,
        RED: 0
    },
    
    COLORS: {
        SNAKE_HEAD: '#e94560',
        SNAKE_BODY: '#ff8a9d',
        ORB_GREEN: '#2ecc71',
        ORB_GOLD: '#f1c40f',
        ORB_BLUE: '#00ffff',
        ORB_RED: '#ff0000'
    }
};

const TILE_COUNT = CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE;
