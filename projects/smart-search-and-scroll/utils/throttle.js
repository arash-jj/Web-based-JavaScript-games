export function throttle(fn, interval, options = {}) {
  let lastTime = 0;
  let timer = null;
  const { leading = true, trailing = true } = options;

  return function (...args) {
    const now = Date.now();

    // Leading edge: first call
    if (lastTime === 0 && !leading) {
      lastTime = now;
    }

    const remaining = interval - (now - lastTime);

    if (remaining <= 0) {
      // Time to execute
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer && trailing) {
      // Schedule trailing edge
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

// Throttle scroll handler – max once per 200ms
// const handleScroll = throttle(() => {
//   console.log("Scroll position:", window.scrollY);
// }, 200);

// window.addEventListener("scroll", handleScroll);
