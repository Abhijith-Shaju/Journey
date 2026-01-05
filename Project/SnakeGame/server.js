const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// --- GLOBAL STATE ---
let players = {}; 
const BOTS = [];

// --- MATCH CONFIGURATION ---
const MATCH_DURATION = 180; 
const INTERMISSION_DURATION = 10; 

let matchTime = MATCH_DURATION;
let isIntermission = false;

// 1. NEW: Server waits for a human before ticking
let gameActive = false; 

const BOT_NAMES = ["Bot_Alpha", "Bot_Bravo", "Bot_Charlie", "Bot_Delta", "Bot_Echo"];
const BOT_COUNT = 5;

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

    // 2. NEW: If this is the first human, WAKE UP the server
    const humans = Object.values(players).filter(p => !p.isBot).length;
    if (!gameActive && humans === 0) {
        console.log(">> First Player Joined! Starting Game Loop...");
        gameActive = true;
        startNewMatch(); // Force fresh start
    }

    players[socket.id] = {
        id: socket.id,
        score: 0,
        status: 'ALIVE',
        isBot: false
    };

    socket.emit('time_update', matchTime);

    socket.on('sync_stats', (data) => {
        if (isIntermission) return; 
        if (players[socket.id]) {
            players[socket.id].score = data.score;
            players[socket.id].status = data.status;
        }
    });

    socket.on('sabotage_sent', (payload) => {
        if (isIntermission) return;
        handleSabotage(socket.id, payload.type);
    });

    socket.on('disconnect', () => {
        console.log(`[LEAVE] ${socket.id}`);
        delete players[socket.id];

        // 3. NEW: If last human leaves, FREEZE the server
        const humansLeft = Object.values(players).filter(p => !p.isBot).length;
        if (humansLeft === 0) {
            console.log(">> Lobby Empty. Pausing Game...");
            gameActive = false; // Stop the clock
            matchTime = MATCH_DURATION; // Reset clock for next person
        }
    });
});

// --- GAME LOOPS ---

// 1. THE MATCH CLOCK
setInterval(() => {
    if (!gameActive || isIntermission) return; // Stop if empty or break

    matchTime--;
    io.emit('time_update', matchTime);

    if (matchTime <= 0) endMatch();
}, 1000);

function endMatch() {
    isIntermission = true;
    console.log("[MATCH ENDED]");

    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    const winner = leaderboard[0];

    io.emit('match_ended', {
        winnerName: winner ? winner.id : "No One",
        nextMatchIn: INTERMISSION_DURATION
    });

    setTimeout(() => startNewMatch(), INTERMISSION_DURATION * 1000);
}

function startNewMatch() {
    if (!gameActive) return; // Don't start if everyone left during break

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

    io.emit('match_started', matchTime);
}

// 2. Bot AI Loop
setInterval(() => {
    if (!gameActive || isIntermission) return; // Bots sleep if no humans

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
    if (!gameActive || isIntermission) return; // No attacks if no humans

    const aliveBots = BOTS.filter(id => players[id] && players[id].status === 'ALIVE');
    if (aliveBots.length === 0) return;

    if (Math.random() > 0.6) return; 

    const attackerId = aliveBots[Math.floor(Math.random() * aliveBots.length)];
    handleSabotage(attackerId, 'NO_TURN');
}, 3000);

// 4. Leaderboard Broadcast (Always run this so menu leaderboard works if you want)
setInterval(() => {
    // We can pause this too if we want to save resources, but keeping it running
    // ensures a fresh connection gets data immediately.
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    io.emit('leaderboard_update', leaderboard);
}, 500);

// --- HELPER ---
function handleSabotage(attackerId, type) {
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    const myRankIndex = leaderboard.findIndex(p => p.id === players[attackerId]?.id || p.id === attackerId);

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
            io.to(targetObj.id).emit('sabotage_received', { type: type, attacker: attackerId });
        }
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`>> SERVER RUNNING ON http://localhost:${PORT}`);
});