// Wait for window load
window.onload = () => {
    const menu = document.getElementById('main-menu');
    const playBtn = document.getElementById('play-btn');

    // Button Listener
    playBtn.addEventListener('click', () => {
        // 1. Hide the Menu
        menu.style.display = 'none';

        // 2. Start the Game Engine
        // We only instantiate the Game class now. 
        // This prevents connecting to the server before the user is ready.
        new Game();
    });
};