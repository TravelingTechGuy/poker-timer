# Poker Timer

Poker Timer is a specialized web application designed for poker dealers to manage player turn times smoothly and fairly. Designed specifically for use on a tablet or smartphone, it features a unique dual-sided display to provide clear visibility for both the dealer and the player sitting across the table.

[See it running](https://pokey-timer.netlify.app) [![Netlify Status](https://api.netlify.com/api/v1/badges/d1aa9c3e-cb45-4bc9-a20d-edadfe0960dd/deploy-status)](https://app.netlify.com/projects/pokey-timer/deploys)

## Features

- **Continuous Dealer Mode**: Designed for one-handed operation. The dealer simply taps the screen to move action to the next player, eliminating repetitive button presses.
- **Dual-Sided Layout**: The dealer sees the timer normally at the bottom of the screen, while the top of the screen displays a mirrored (180-degree rotated) timer so a player sitting across the table can read it effortlessly.
- **Adjustable Time Limits**: Dealers can choose between 15, 30 (default), 45, or 60-second countdowns via a settings menu.
- **Hybrid Screen Wake Lock**: Uses the modern native Wake Lock API (with a robust NoSleep.js fallback) to ensure the device screen never turns off or dims while a hand is actively running.
- **Audio Feedback**: Utilizes the Web Audio API to provide lightweight synthesized sound alerts without loading external audio files.
  - An increasingly intense warning beep plays during the final 5 seconds.
  - A definitive "whomp-whomp" sound plays when the timer hits zero.

## How to Use the App

The app is built around intuitive gesture controls so the dealer can keep the game moving naturally: tap, muck, tap, muck.

1. **Setup**: Tap the **gear icon (⚙️)** in the bottom right to select the standard countdown duration (15s, 30s, 45s, 60s).
2. **Start a Hand**: Tap the large **Start Hand** button in the center of the screen to begin.
3. **Next Player (Single Tap)**: As action moves around the table, simply tap *anywhere* on the empty screen to reset the countdown for the next player.
4. **Time Extensions**: Tap the green **+30** pill in the bottom left to instantly add 30 seconds to the current player's clock without pausing the countdown.
5. **Pause for Rulings (Long Press)**: If a dispute or interruption occurs, **long-press** the screen (hold for ~1 second) to pause the timer. A second long-press resumes it exactly where it left off.
6. **End of Hand**: At the end of a hand, **long-press** to pause the timer. A **Start New Hand** button will appear in the center of the screen to reset the clock for the next deal.

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

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. All rights reserved Traveling Tech Guy LLC.
