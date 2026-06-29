// @ts-ignore
import NoSleep from 'nosleep.js';

let nativeWakeLock: any = null;
let noSleep: any = null;

export const requestWakeLock = async () => {
  if (!noSleep) {
    noSleep = new NoSleep();
  }

  // Check if native Wake Lock API is supported
  if ('wakeLock' in navigator) {
    try {
      // @ts-ignore
      nativeWakeLock = await navigator.wakeLock.request('screen');
      console.log('Native Screen Wake Lock activated');
      return;
    } catch (err) {
      console.warn('Native Wake Lock failed, falling back to NoSleep.js', err);
    }
  }
  
  // Fallback for older iOS / browsers
  noSleep.enable();
  console.log('NoSleep.js activated');
};

export const releaseWakeLock = () => {
  if (nativeWakeLock !== null) {
    nativeWakeLock.release().then(() => {
      nativeWakeLock = null;
      console.log('Native Screen Wake Lock released');
    });
  } else if (noSleep) {
    noSleep.disable();
    console.log('NoSleep.js released');
  }
};
