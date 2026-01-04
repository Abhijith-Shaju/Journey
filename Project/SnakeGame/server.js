const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// --- GLOBAL STATE ---
let players = {}; 
const BOTS = [];

// --- BOT CONFIGURATION ---
const BOT_NAMES = ["Bot_Alpha", "Bot_Bravo", "Bot_Charlie", "Bot_Delta", "Bot_Echo"];
const BOT_COUNT = 5;

// Initialize Bots
function initBots() {
    for (let i = 0; i < BOT_COUNT; i++) {
        const botId = `bot_${i}`;
        // Start low (10-40 pts) so player can catch up
        players[botId] = {
            id: BOT_NAMES[i], 
            score: Math.floor(Math.random() * 30) + 10, 
            status: 'ALIVE',
            isBot: true 
        };
        BOTS.push(botId);
    }
}

initBots();

io.on('connection', (socket) => {
    console.log(`[JOIN] ${socket.id}`);

    players[socket.id] = {
        id: socket.id,
        score: 0,
        status: 'ALIVE',
        isBot: false
    };

    socket.on('sync_stats', (data) => {
        if (players[socket.id]) {
            players[socket.id].score = data.score;
            players[socket.id].status = data.status;
        }
    });

    socket.on('sabotage_sent', (payload) => {
        handleSabotage(socket.id, payload.type);
    });

    socket.on('disconnect', () => {
        console.log(`[LEAVE] ${socket.id}`);
        delete players[socket.id];
    });
});

// --- CORE GAME LOOP (SERVER SIDE) ---

// 1. Bot AI Loop (Score/Death Simulation) - Updates every 3s
setInterval(() => {
    BOTS.forEach(botId => {
        const bot = players[botId];
        if (!bot) return;
        if (bot.status === 'DEAD') return; 

        // 15% Chance to die
        if (Math.random() < 0.15) {
            bot.status = 'DEAD';
            bot.score = Math.floor(bot.score * 0.8); 
            setTimeout(() => { if (players[botId]) players[botId].status = 'ALIVE'; }, 3000);
        } else {
            // Gain small points (5-10)
            const gain = Math.floor(Math.random() * 5) + 5;
            bot.score += gain;
        }
    });
}, 3000);

// =========================================================
// 2. BOT ATTACK LOOP (CHAOS MODE TUNING)
// =========================================================
setInterval(() => {
    const aliveBots = BOTS.filter(id => players[id] && players[id].status === 'ALIVE');
    if (aliveBots.length === 0) return;

    // TUNING: 60% Chance a bot attacks every 3 seconds
    // (Old setting was 20% every 8 seconds)
    if (Math.random() > 0.6) return; 

    const attackerId = aliveBots[Math.floor(Math.random() * aliveBots.length)];
    
    // Log it so you can see it happening in terminal
    console.log(`[CHAOS] ${players[attackerId].id} sent a SABOTAGE!`);
    
    handleSabotage(attackerId, 'NO_TURN');

}, 3000); // Check every 3 seconds!
// =========================================================


// 3. Leaderboard Broadcast
setInterval(() => {
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    io.emit('leaderboard_update', leaderboard);
}, 500);

// --- HELPER FUNCTIONS ---
function handleSabotage(attackerId, type) {
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    
    const myRankIndex = leaderboard.findIndex(p => 
        (p.isBot && p.id === players[attackerId].id) || (!p.isBot && p.id === attackerId)
    );

    if (myRankIndex === -1) return;

    let targetId = null;

    if (myRankIndex === 0) {
        if (leaderboard.length > 1) targetId = leaderboard[1].id; 
    } else {
        targetId = leaderboard[myRankIndex - 1].id; 
    }
    
    if (targetId) {
        const targetObj = Object.values(players).find(p => p.id === targetId);
        
        if (targetObj && !targetObj.isBot) {
            console.log(`[ATTACK] ${attackerId} -> ${targetObj.id}`);
            io.to(targetObj.id).emit('sabotage_received', {
                type: type,
                attacker: attackerId
            });
        }
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`>> SERVER RUNNING ON http://localhost:${PORT}`);
});