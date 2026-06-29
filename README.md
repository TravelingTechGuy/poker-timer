# Poker Timer

Poker Timer is a specialized web application designed for poker dealers to manage player turn times smoothly and fairly. Designed specifically for use on a tablet or smartphone, it features a unique dual-sided display to provide clear visibility for both the dealer and the player sitting across the table.

## Features

- **Dual-Sided Layout**: The dealer sees the timer normally at the bottom of the screen, while the top of the screen displays a mirrored (180-degree rotated) timer so a player sitting across the table can read it effortlessly.
- **Adjustable Time Limits**: Dealers can choose between 15, 30 (default), 45, or 60-second countdowns.
- **Audio Feedback**: Utilizes the Web Audio API to provide synthesized sound alerts.
  - An increasingly intense warning beep plays during the final 5 seconds.
  - A definitive "whomp-whomp" sound plays when the timer hits zero.
- **Pause & Resume**: Important for pausing the clock if a situation arises that shouldn't cost the current player their time.
- **Lightweight & Fast**: Synthesized audio means there are no external MP3/WAV files to load.

## Setup and Installation

This app is built with React, TypeScript, and Vite.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Running Locally

1. Clone the repository:
   ```bash
   git clone git@github.com:TravelingTechGuy/poker-timer.git
   cd poker-timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the `localhost` URL provided in your terminal. For testing on your phone or tablet on the same network, you can run `npm run dev --host` to expose it to your local network.

## Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will compile the TypeScript and React code into optimized HTML, CSS, and JS in the `dist` folder. The app is pre-configured with a `netlify.toml` file, making it ready to deploy on Netlify out of the box.

## How to Use the App

1. **Select Duration**: While the timer is stopped, tap the duration pills (15s, 30s, 45s, 60s) above the Start button to set the initial time limit.
2. **Start the Clock**: Tap **Start**. The app requires this first interaction to initialize the audio context, ensuring sound alerts will play.
3. **Pause/Continue**: If there's an interruption in the game, tap **Pause**. Tap **Continue** to resume exactly where the clock stopped.
4. **Reset**: Tap **Reset** to abort the current countdown and return the clock to the initial selected duration.
