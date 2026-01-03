const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// 1. The Lobby State (Where we store everyone's info)
let players = {}; 

io.on('connection', (socket) => {
    console.log(`[JOIN] ${socket.id}`);

    // 2. Initialize new player in the lobby
    players[socket.id] = {
        id: socket.id,
        score: 0,
        status: 'ALIVE'
    };

    // 3. Listen for Score Updates from Client
    socket.on('sync_stats', (data) => {
        if (players[socket.id]) {
            players[socket.id].score = data.score;
            players[socket.id].status = data.status;
        }
    });

    // 4. Handle Sabotage Attacks
    socket.on('sabotage_sent', (payload) => {
        // Get the current leaderboard sorted by score
        const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
        
        // Find my current rank (Index 0 is Rank 1)
        const myRankIndex = leaderboard.findIndex(p => p.id === socket.id);
        
        if (myRankIndex === -1) return; // Should not happen

        let targetId = null;

        // TARGETING LOGIC:
        // If I am Rank 1 -> Attack Rank 2
        // If I am Rank 2+ -> Attack the person above me (Rank - 1)
        if (myRankIndex === 0) {
            // I am #1, attack #2 (if they exist)
            if (leaderboard.length > 1) targetId = leaderboard[1].id;
        } else {
            // Attack the person above me
            targetId = leaderboard[myRankIndex - 1].id;
        }

        // Send the attack if we found a valid target
        if (targetId) {
            console.log(`[ATTACK] ${socket.id} -> ${targetId} (${payload.type})`);
            io.to(targetId).emit('sabotage_received', {
                type: payload.type,
                attacker: socket.id
            });
        }
    });

    // 4. Handle Disconnects
    socket.on('disconnect', () => {
        console.log(`[LEAVE] ${socket.id}`);
        delete players[socket.id];
    });
});

// 5. The Heartbeat: Broadcast Leaderboard every 500ms
setInterval(() => {
    // Convert object to array and sort by score (Highest first)
    const leaderboard = Object.values(players).sort((a, b) => b.score - a.score);
    
    // Send to EVERYONE
    io.emit('leaderboard_update', leaderboard);
}, 500);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`>> SERVER RUNNING ON http://localhost:${PORT}`);
});