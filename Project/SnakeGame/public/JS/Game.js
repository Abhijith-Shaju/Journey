/**
 * ==========================================
 * MAIN GAME ENGINE
 * ==========================================
 * Orchestrates the game loop, rendering, and game state.
 */
class Game {
    constructor() {
        // --- NEW: NETWORK CONNECTION ---
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log("Network Status: Connected with ID", this.socket.id);
            this.log("Connected to Server.", "highlight");
        });


        this.socket.on('connect', () => {
            console.log("Connected with ID:", this.socket.id);
        });

        // --- LISTEN FOR LEADERBOARD ---
        this.socket.on('leaderboard_update', (leaderboard) => {
            this.drawLeaderboard(leaderboard);
        });

        // --- LISTEN FOR ATTACKS ---
        this.socket.on('sabotage_received', (data) => {
            this.triggerSabotage(data.type);
            this.log(`UNDER ATTACK! Effect: ${data.type}`, 'sabotage-msg');
        });



        // --- NEW TIME & MATCH LISTENERS ---
        this.socket.on('time_update', (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.uiTimer.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (seconds <= 10) this.uiTimer.style.color = 'red';
            else this.uiTimer.style.color = 'white';
        });

        this.socket.on('match_ended', (data) => {
            this.matchActive = false;
            this.overlay.style.display = 'flex';
            this.winnerText.textContent = `WINNER: ${data.winnerName}`;
            
            // Countdown visual logic
            let timeLeft = data.nextMatchIn;
            this.countdownText.textContent = `Next match in ${timeLeft}s...`;
            const interval = setInterval(() => {
                timeLeft--;
                this.countdownText.textContent = `Next match in ${timeLeft}s...`;
                if (timeLeft <= 0) clearInterval(interval);
            }, 1000);
        });

        this.socket.on('match_started', () => {
            this.matchActive = true;
            this.overlay.style.display = 'none';
            this.log("NEW MATCH STARTED!", "highlight");
            this.snake.score = 0;
            this.snake.reset(); // Full reset
            this.items = []; // Clear board
            for(let i=0; i<CONFIG.MAX_ITEMS; i++) this.spawnSingleItem();
            this.updateUI();
        });

        // -------------------------------

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.audio = new AudioController();
        this.particles = new ParticleSystem();

        this.input = new InputHandler();
        this.snake = new Snake();
        
        this.items = [];
        this.spawnInitialItems();

        this.lastTime = 0;
        this.accumulator = 0;
        this.tickInterval = 1000 / CONFIG.TICK_RATE;

        this.skipTailThisTick = false;

        // Respawn State Flags
        this.waitingForInput = false;
        this.respawnTimer = null;

        this.matchActive = true; // New Flag

        // UI Refs for Timer & Overlay
        this.uiTimer = document.getElementById('time-display');
        this.overlay = document.getElementById('game-over-overlay');
        this.winnerText = document.getElementById('winner-text');
        this.countdownText = document.getElementById('countdown-text');

        // UI References
        this.uiScore = document.getElementById('score-display');
        this.uiMainScore = document.getElementById('ui-score');
        this.uiLength = document.getElementById('length-display');
        this.uiStatus = document.getElementById('status-display');
        this.uiLog = document.getElementById('kill-feed');

        // Global Listener for Respawn Key
        window.addEventListener('keydown', () => {
            if (this.waitingForInput) {
                this.triggerRespawn();
            }
        });

        document.getElementById('quit-btn').addEventListener('click', () => {
            if (confirm("Are you sure you want to quit to the Main Menu?")) {
                window.location.reload();
            }
        });

        // Start Loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    log(msg, className) {
        const div = document.createElement('div');
        div.textContent = `> ${msg}`;
        if (className) div.className = className;
        this.uiLog.prepend(div);
    }

    spawnInitialItems() {
        this.items = [];
        for (let i = 0; i < CONFIG.MAX_ITEMS; i++) {
            this.spawnSingleItem();
        }
    }

    spawnSingleItem() {
        let attempts = 0;
        let validPosition = false;
        let position = { x: 0, y: 0 };

        // Try to find a free spot 200 times before giving up (prevents infinite loop)
        while (!validPosition && attempts < 200) {
            attempts++;
            position = {
                x: Math.floor(Math.random() * TILE_COUNT),
                y: Math.floor(Math.random() * TILE_COUNT)
            };

            validPosition = true;

            // Check Collision with Snake
            for (const segment of this.snake.body) {
                if (segment.x === position.x && segment.y === position.y) {
                    validPosition = false;
                    break;
                }
            }

            // Check Collision with Existing Items
            for (const item of this.items) {
                if (item.x === position.x && item.y === position.y) {
                    validPosition = false;
                    break;
                }
            }
        }

        if (validPosition) {
            // Determine Type based on Spawn Rates
            const rand = Math.random();
            let type = 'GREEN';
            
            if (rand < CONFIG.SPAWN_RATES.GREEN) {
                type = 'GREEN';
            } else if (rand < CONFIG.SPAWN_RATES.GREEN + CONFIG.SPAWN_RATES.GOLD) {
                type = 'GOLD';
            } else if (rand < CONFIG.SPAWN_RATES.GREEN + CONFIG.SPAWN_RATES.GOLD + CONFIG.SPAWN_RATES.BLUE) {
                type = 'BLUE';
            } else {
                type = 'RED';
            }

            this.items.push({
                x: position.x,
                y: position.y,
                type: type,
                spawnTime: Date.now()
            });
        }
    }

    update() {
        this.particles.update();

        if (!this.snake.alive || !this.matchActive) return;

        this.input.update();
        const moved = this.snake.update(this.input.direction);


        const head = this.snake.body[0];
        // If snake died during update, stop here
        if (!head) return; 

        const now = Date.now();

        // 1. Remove Expired Gold Orbs
        this.items = this.items.filter(item => {
            if (item.type === 'GOLD' && now - item.spawnTime > CONFIG.GOLD_LIFETIME) {
                // Expired: Spawn a replacement to keep item count up
                this.spawnSingleItem(); 
                return false; // Remove from array
            }
            return true; // Keep in array
        });

        // 2. Ensure we always have max items (if some expired or were missing)
        while (this.items.length < CONFIG.MAX_ITEMS) {
            this.spawnSingleItem();
        }

        // 3. Check for Item Collection
        let eatenIndex = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].x === head.x && this.items[i].y === head.y) {
                eatenIndex = i;
                break;
            }
        }

        if (eatenIndex > -1) {
            // --- ITEM EATEN ---
            const item = this.items[eatenIndex];
            
            // Add Score
            this.snake.score += CONFIG.SCORES[item.type];
            // Ensure score doesn't drop below 0 (just in case)
            if (this.snake.score < 0) this.snake.score = 0;

            // Handle Special Effects
            this.handleItemEffect(item);

            // Refresh Spawns (The "Chaos" Mechanic)
            this.spawnInitialItems();
            this.updateUI();

        } else {
            // --- NO ITEM EATEN ---
            // Remove tail to maintain current length (movement)
                if (moved && !this.skipTailThisTick) {
                    this.snake.body.pop();
                }
        }
        this.skipTailThisTick = false; // reset every tick

        // 4. Death Check (Post-movement)
        if (!this.snake.alive && !this.respawnTimer && !this.waitingForInput) {
            this.handleDeath();
        }
    }

    handleItemEffect(item) {
        if (item.type === 'RED') {
            this.audio.playSabotage();
            this.log("Red Star! Sending Sabotage...", 'sabotage-msg');
            this.socket.emit('sabotage_sent', { type: 'NO_TURN' });
        } 
        else if (item.type === 'BLUE') {
            this.audio.playBuff();
            const buffs = ['Invincible', 'ShortenTail'];
            const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];

            // ====== SHORTEN TAIL ======
            if (randomBuff === 'ShortenTail') {
                const shrinkAmount = 3;   // remove 3 to offset growth
                const minLength = 3;

                const newLength = Math.max(
                    minLength,
                    this.snake.body.length - shrinkAmount
                );

                this.snake.body.splice(newLength);
                this.log(`Buff: Tail Shortened (${this.snake.body.length - newLength})`, 'buff-msg');
                
                this.updateUI();
            }

            // ====== INVINCIBLE ======
            else if (randomBuff === 'Invincible') {
                this.snake.invincible = true;
                this.canvas.style.boxShadow = "0 0 25px cyan";
                this.log("Buff: INVINCIBLE (3s)", 'buff-msg');

                setTimeout(() => {
                    this.snake.invincible = false;
                    this.canvas.style.borderColor = '#e94560';
                    this.canvas.style.boxShadow = "0 0 20px rgba(233, 69, 96, 0.2)";
                    this.log("Invincibility Ended", 'highlight');
                }, 3000);

                this.updateUI();
            }
        }

        else if (item.type === 'GOLD') {
            this.audio.playEat();
            this.log("GOLD ORB! +15 Points", 'highlight');
        }
        
        else if (item.type === 'GREEN'){
            this.audio.playEat();
        }
    }

    triggerSabotage(type) {
        // 1. Check Immunity
        if (this.input.isImmune || this.snake.invincible) { 
            this.log("Blocked Sabotage (Invincible)!", "buff-msg"); 
            return; 
        }

        this.audio.playSabotage();
        
        // Visual Flash (Red Alert)
        this.canvas.style.backgroundColor = '#550000';
        this.canvas.style.borderColor = 'red';
        setTimeout(() => {
            this.canvas.style.backgroundColor = '#000';
            this.canvas.style.borderColor = '#e94560';
        }, 500);

        // --- APPLY SPECIFIC EFFECT ---
        let msg = "ATTACKED!";
        
        if (type === 'NO_TURN') {
            msg = "⚠ JAMMED ⚠";
            this.input.inputLocked = true;
            setTimeout(() => this.input.inputLocked = false, 2000);

        } else if (type === 'REVERSE') {
            msg = "⚠ CONFUSION ⚠";
            this.input.reversed = true;
            this.canvas.style.filter = "hue-rotate(90deg)"; // Weird color shift
            
            setTimeout(() => { 
                this.input.reversed = false; 
                this.canvas.style.filter = "none";
            }, 4000); // Lasts 4 seconds

        } else if (type === 'BLIND') {
            msg = "⚠ BLINDNESS ⚠";
            const blind = document.getElementById('blindness-overlay');
            blind.style.display = 'flex';
            
            setTimeout(() => { blind.style.display = 'none'; }, 2000); // Lasts 2s

        } else if (type === 'SPEED') {
            msg = "⚠ HYPER SPEED ⚠";
            // Double speed (Tick Rate * 2)
            // We modify the interval, not the config
            this.tickInterval = 1000 / (CONFIG.TICK_RATE * 2.5); 
            
            setTimeout(() => { 
                this.tickInterval = 1000 / CONFIG.TICK_RATE; // Reset
            }, 3000); // Lasts 3s
        }

        // --- UPDATE UI ---
        this.uiStatus.textContent = msg;
        this.uiStatus.style.color = "red";
        this.log(`Hit by ${type}!`, "sabotage-msg");

        // Give post-hit immunity (The "Cleanse")
        setTimeout(() => {
            this.uiStatus.textContent = "ALIVE";
            this.uiStatus.style.color = "lime";
            this.input.isImmune = true;
            setTimeout(() => this.input.isImmune = false, 3000);
        }, 3000); // Wait for worst effect to end before resetting status
    }

    handleDeath() {
        // 1. Initial State
        let timeLeft = 3;
        this.uiStatus.style.color = 'red';
        this.uiStatus.textContent = `DEAD (Respawn ${timeLeft}s)`;
        this.log(`Died. Score: ${this.snake.score}. Penalizing...`, 'sabotage-msg');
        
        // 2. Play Effects
        this.audio.playDie();
        this.particles.explode(this.snake.body[0].x, this.snake.body[0].y, '#e94560');
        
        // 3. Update Server immediately
        this.updateUI();

        // 4. Start Countdown Loop
        // We use setInterval instead of setTimeout so we can update the UI every second
        const countdownInterval = setInterval(() => {
            timeLeft--;
            
            if (timeLeft > 0) {
                // Update text: "Respawn 2s", "Respawn 1s"
                this.uiStatus.textContent = `DEAD (Respawn ${timeLeft}s)`;
            } else {
                // Time is up! Stop the loop
                clearInterval(countdownInterval);
                
                // Switch to "Waiting" state
                this.waitingForInput = true;
                this.uiStatus.textContent = 'PRESS ANY KEY';
                this.uiStatus.style.color = 'white';
            }
        }, 1000); // Run every 1000ms (1 second)
    }

    triggerRespawn() {
        this.waitingForInput = false;
        this.input.inputLocked = false;
        
        const newLength = Math.min(15, Math.floor(this.snake.score / 5) + 3);
        this.snake.reset(newLength);
        
        // --- ADD THIS LINE ---
        this.input.reset(); 
        // --------------------

        this.items = [];
        for(let i=0; i<CONFIG.MAX_ITEMS; i++) this.spawnSingleItem();
        
        this.uiStatus.textContent = 'ALIVE';
        this.uiStatus.style.color = 'lime';
        this.updateUI();
    }

    updateUI() {
        this.uiScore.textContent = this.snake.score;
        this.uiMainScore.textContent = this.snake.score;
        this.uiLength.textContent = this.snake.body.length;

        // --- NEW: REPORT TO SERVER ---
        this.socket.emit('sync_stats', { 
            score: this.snake.score,
            status: this.snake.alive ? 'ALIVE' : 'DEAD'
        });
    }

    drawLeaderboard(data) {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = ''; // Clear old list

        // Take top 10
        data.slice(0, 10).forEach((player, index) => {
            const div = document.createElement('div');
            div.className = 'row';
            
            // Highlight myself
            if (player.id === this.socket.id) {
                div.style.color = '#e94560';
                div.style.fontWeight = 'bold';
                div.textContent = `${index + 1}. YOU - ${player.score}`;
            } else {
                div.style.color = '#ccc';
                div.textContent = `${index + 1}. Player ${player.id.substr(0,4)} - ${player.score}`;
            }
            
            // Show Dead Status
            if (player.status === 'DEAD') {
                div.style.textDecoration = 'line-through';
                div.style.opacity = '0.5';
            }

            list.appendChild(div);
        });
    }

    draw() {
        const ctx = this.ctx;
        
        // Clear Screen
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CONFIG.CANVAS_SIZE, CONFIG.CANVAS_SIZE);

        // --- NEW: DRAW PARTICLES ---
        this.particles.draw(ctx);

        const now = Date.now();

        // Draw Items
        for (const item of this.items) {
            const px = item.x * CONFIG.GRID_SIZE;
            const py = item.y * CONFIG.GRID_SIZE;
            const center = CONFIG.GRID_SIZE / 2;

            ctx.beginPath();
            let color = CONFIG.COLORS.ORB_GREEN;

            // Determine Color & Blink Logic
            if (item.type === 'GOLD') {
                const age = now - item.spawnTime;
                // Blink white in last 1.5 seconds
                const isBlinking = age > CONFIG.GOLD_LIFETIME - 1500 && Math.floor(now / 150) % 2 === 0;
                color = isBlinking ? '#fff' : CONFIG.COLORS.ORB_GOLD;
            } else if (item.type === 'BLUE') {
                color = CONFIG.COLORS.ORB_BLUE;
            } else if (item.type === 'RED') {
                color = CONFIG.COLORS.ORB_RED;
            }

            ctx.fillStyle = color;

            if (item.type === 'RED') {
                // Draw Diamond for Red Star
                ctx.moveTo(px + center, py);
                ctx.lineTo(px + CONFIG.GRID_SIZE, py + center);
                ctx.lineTo(px + center, py + CONFIG.GRID_SIZE);
                ctx.lineTo(px, py + center);
                ctx.fill();
            } else {
                // Draw Circle for Orbs
                ctx.arc(px + center, py + center, center - 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Extra ring for Gold
                if (item.type === 'GOLD') {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }

        // Draw Snake
        if (this.snake.alive || Math.floor(now / 200) % 2 === 0) { // Blink if dead
            this.snake.body.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? CONFIG.COLORS.SNAKE_HEAD : CONFIG.COLORS.SNAKE_BODY;
                if (this.snake.invincible) this.ctx.fillStyle = '#00ffff';
                ctx.fillRect(
                    segment.x * CONFIG.GRID_SIZE + 1,
                    segment.y * CONFIG.GRID_SIZE + 1,
                    CONFIG.GRID_SIZE - 2,
                    CONFIG.GRID_SIZE - 2
                );
            });
        }
    }

    gameLoop(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        
        // Calculate how much time passed since last frame
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Safety Cap: If you tabbed out for 1 hour, don't try to simulate 
        // 1 hour of frames instantly (it would freeze the browser).
        // Cap it at 2 seconds (enough to kill the snake if it hits a wall).
        const safeDelta = Math.min(deltaTime, 3000); 

        this.accumulator += safeDelta;

        // "Catch Up" Loop
        // Keep running update() until we have used up all the accumulated time.
        while (this.accumulator >= this.tickInterval) {
            this.update(); // Move Snake
            this.accumulator -= this.tickInterval; // Subtract time used

            // Optimization: If snake crashed during catch-up, stop calculating.
            if (!this.snake.alive) {
                this.accumulator = 0;
                break;
            }
        }

        // Draw only once after all physics updates are done
        this.draw();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}
