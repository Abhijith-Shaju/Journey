const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// --- GLOBAL STATE ---
let players = {}; 
const BOTS = [];

// --- MATCH CONFIGURATION ---
const MATCH_DURATION = 180; // 180 Seconds (3 Minutes)
const INTERMISSION_DURATION = 10; // 10 Seconds break

let matchTime = MATCH_DURATION;
let isIntermission = false;

// --- BOT CONFIGURATION ---
const BOT_NAMES = ["Bot_Alpha", "Bot_Bravo", "Bot_Charlie", "Bot_Delta", "Bot_Echo"];
const BOT_COUNT = 5;

// Initialize Bots
function initBots() {
    for (let i = 0; i < BOT_COUNT; i++) {
        const botId = `bot_${i}`;
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

    // Add Player
    players[socket.id] = {
        id: socket.id,
        score: 0,
        status: 'ALIVE',
        isBot: false
    };

    // Send current time immediately so they don't wait for tick
    socket.emit('time_update', matchTime);

    socket.on('sync_stats', (data) => {
        // If match is over, ignore score updates
        if (isIntermission) return; 
        
        if (players[socket.id]) {
            players[socket.id].score = data.score;
            players[socket.id].status = data.status;
        }
    });

    socket.on('sabotage_sent', (payload) => {
        if (isIntermission) return; // No fighting during break
        handleSabotage(socket.id, payload.type);
    });

    socket.on('disconnect', () => {
        console.log(`[LEAVE] ${socket.id}`);
        delete players[socket.id];
    });
});

// --- GAME LOOPS ---

// 1. THE MATCH CLOCK (Runs every 1 second)
setInterval(() => {
    if (isIntermission) return; // Clock pauses during break

    matchTime--;

    // Broadcast Time
    io.emit('time_update', matchTime);

    // MATCH END CONDITION
    if (matchTime <= 0) {
        endMatch();
    }
}, 1000);

function endMatch() {
    isIntermission = true;
    console.log("[MATCH ENDED]");

    // Find Winner
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    const winner = leaderboard[0];

    // Broadcast Results
    io.emit('match_ended', {
        winnerName: winner ? winner.id : "No One",
        nextMatchIn: INTERMISSION_DURATION
    });

    // Start Countdown to New Match
    setTimeout(() => {
        startNewMatch();
    }, INTERMISSION_DURATION * 1000);
}

function startNewMatch() {
    console.log("[NEW MATCH STARTED]");
    isIntermission = false;
    matchTime = MATCH_DURATION;

    // Reset Scores
    Object.keys(players).forEach(key => {
        if (players[key].isBot) {
            players[key].score = Math.floor(Math.random() * 30) + 10;
        } else {
            players[key].score = 0;
            players[key].status = 'ALIVE';
        }
    });

    // Tell clients to wipe their boards
    io.emit('match_started', matchTime);
}

// 2. Bot AI Loop (Simulation)
setInterval(() => {
    if (isIntermission) return; // Bots sleep during break

    BOTS.forEach(botId => {
        const bot = players[botId];
        if (!bot || bot.status === 'DEAD') return; 

        if (Math.random() < 0.15) {
            bot.status = 'DEAD';
            bot.score = Math.floor(bot.score * 0.8); 
            setTimeout(() => { if (players[botId]) players[botId].status = 'ALIVE'; }, 3000);
        } else {
            bot.score += Math.floor(Math.random() * 5) + 5;
        }
    });
}, 3000);

// 3. Chaos/Attack Loop
setInterval(() => {
    if (isIntermission) return;

    const aliveBots = BOTS.filter(id => players[id] && players[id].status === 'ALIVE');
    if (aliveBots.length === 0) return;

    if (Math.random() > 0.6) return; 

    const attackerId = aliveBots[Math.floor(Math.random() * aliveBots.length)];
    handleSabotage(attackerId, 'NO_TURN');
}, 3000);

// 4. Leaderboard Broadcast
setInterval(() => {
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    io.emit('leaderboard_update', leaderboard);
}, 500);

// --- HELPER ---
function handleSabotage(attackerId, type) {
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    
    // Find Attacker Rank
    // Note: Players store ID as socket.id, Bots store Name as socket.id in logic (simplified)
    // We check both for robustness
    const myRankIndex = leaderboard.findIndex(p => p.id === players[attackerId]?.id || p.id === attackerId);

    if (myRankIndex === -1) return;

    let targetId = null;
    if (myRankIndex === 0) {
        if (leaderboard.length > 1) targetId = leaderboard[1].id; 
    } else {
        targetId = leaderboard[myRankIndex - 1].id; 
    }
    
    if (targetId) {
        // Find Target Socket
        // If target is bot, p.id is Name. If target is human, p.id is SocketID.
        const targetObj = Object.values(players).find(p => p.id === targetId);
        
        if (targetObj && !targetObj.isBot) {
            io.to(targetObj.id).emit('sabotage_received', { type: type, attacker: attackerId });
        }
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`>> SERVER RUNNING ON http://localhost:${PORT}`);
});