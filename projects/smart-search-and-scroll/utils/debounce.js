/**
 * Note: this is a simple implementation 
 * of debounce logic, if you are looking for challenge
 * you can try managing race conditions and add Cancel & Flush to the logic
 */

export function debounce(fn, delay, options = {}) {
  let timer = null;
  const { leading = false, trailing = true } = options;

  return function (...args) {
    let invokeNow = false;

    // If leading and no timer, invoke immediately
    if (leading && !timer) {
      invokeNow = true;
    }

    // Clear previous timer
    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing && !invokeNow) {
        fn.apply(this, args);
      }
      timer = null;
    }, delay);

    // Execute immediately on leading edge
    if (invokeNow) {
      fn.apply(this, args);
    }
  };
}

// ---VISUAL DEMONSTRATION---

// Create debounce function
const log = debounce((val) => console.log(val), 1000);

// Rapid calls
log("a"); // cleared
log("b"); // cleared
log("c"); // only this appears after 1s pause
