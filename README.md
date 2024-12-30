# Cube Platformer

A simple 2D platformer game built with HTML, CSS, and JavaScript. Navigate a cube through platforms, avoid enemies, and collect coins!

## Features

*   Simple controls: Move left, right, and jump to navigate the levels.
*   Platforming action: Jump between platforms, avoid falling, and reach the top to win.
*   Enemy avoidance: Dodge moving enemies patrolling the platforms.
*   Coin collection: Gather coins for score.
*   Score tracking: Keep track of your score and high score.
*   Touch controls: Playable on mobile devices with on-screen touch buttons.
*   Responsive design: The game adapts to different screen sizes.
*   Game states: Includes start, pause, and game over states.
*   Local storage: High score is stored in the browser's local storage.

## How to Play

1.  Open `index.html` in your browser.
2.  Use the on-screen buttons or keyboard arrows to move left and right, and the spacebar or the up arrow to jump.
3.  Avoid the enemies, collect coins, and try to reach the top platform to win.

## Controls

*   **Keyboard:**
    *   `Left Arrow`: Move Left
    *   `Right Arrow`: Move Right
    *   `Up Arrow` or `Spacebar`: Jump
*   **Touchscreen:**
    *   Use on-screen arrow buttons for movement, and the up arrow for jumping

## Technologies Used

*   HTML
*   CSS
*   JavaScript

## Project Structure

cube-platformer/

├── index.html

├── game.js

└── README.md

## Game Development Notes
*   Canvas: The game is rendered using HTML5 canvas element.
*   Game Loop: Uses `requestAnimationFrame` for animation.
*   Collision Detection: Uses simple rectangular collision detection.
