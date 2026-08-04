// The composer - takes an array of middleware, returns a function
export function compose(middlewares) {
  return function (ctx) {
    let index = -1;

    function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;

      const fn = middlewares[i];
      if (!fn) return; // End of chain

      // Call the middleware with ctx and a callback for next
      return fn(ctx, () => dispatch(i + 1));
    }
    return dispatch(0);
  };
}

// Demo
// const pipeline = compose([
//   (ctx, next) => {
//     console.log("1. Start");
//     next();
//     console.log("1. End");
//   },
//   (ctx, next) => {
//     console.log("2. Start");
//     next();
//     console.log("2. End");
//   },
//   (ctx, next) => {
//     console.log("3. Handler");
//     ctx.body = "Hello World";
//   },
// ]);

// const ctx = {};
// pipeline(ctx);
// console.log(ctx.body);

// Output:
// 1. Start
// 2. Start
// 3. Handler
// 2. End
// 1. End
