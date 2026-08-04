export function composeWithErrorHandling(middlewares) {
  return async function (ctx) {
    let index = -1;

    async function dispatch(i, err) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;

      const fn = middlewares[i];
      if (!fn) {
        if (err) throw err; // Unhandled error
        return;
      }

      try {
        if (err && fn.length === 3) {
          // Error-handling middleware: (err, ctx, next)
          await fn(err, ctx, () => dispatch(i + 1));
        } else if (!err) {
          // Normal middleware
          await fn(err, ctx, () => dispatch(i + 1));
        } else {
          // Skip normal middleware if error exists, go to next
          await dispatch(i + 1, err);
        }
      } catch (e) {
        await dispatch(i + 1, e);
      }
    }
    await dispatch(0);
  };
}

// Demo: error handling
// composeWithErrorHandling([
//   async (ctx, next) => {
//     console.log("1. Before");
//     await next();
//     console.log("1. After");
//   },
//   async (ctx, next) => {
//     console.log("2. Throwing error");
//     throw new Error("Something broke!");
//   },
//   async (ctx, next) => {
//     // This will be skipped due to error
//     console.log("3. Normal (never runs)");
//   },
//   async (err, ctx, next) => {
//     console.log("Error handled:", err.message);
//     ctx.error = err.message;
//     // Optionally call next() to pass to next error handler
//   },
// ])({}).then(() => console.log("Graceful shutdown"));
