class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.volume = 0.1; // Master volume (10%)
    }

    playTone(freq, type, duration) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playEat() {
        // High pitched "Coin" sound
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(900, 'sine', 0.1), 50);
    }

    playDie() {
        // Low pitched "Crash"
        this.playTone(150, 'sawtooth', 0.4);
        this.playTone(100, 'sawtooth', 0.4);
    }

    playSabotage() {
        // Alarming "Siren"
        this.playTone(300, 'square', 0.2);
        setTimeout(() => this.playTone(250, 'square', 0.2), 150);
        setTimeout(() => this.playTone(300, 'square', 0.2), 300);
    }

    playBuff() {
        // Ascending powerup sound
        this.playTone(300, 'sine', 0.1);
        setTimeout(() => this.playTone(400, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(500, 'sine', 0.2), 200);
    }
}