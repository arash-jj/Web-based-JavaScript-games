export function asyncCompose(middlewares) {
  return async function (ctx) {
    let index = -1;

    async function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;

      const fn = middlewares[i];
      if (!fn) return;

      // Await the middleware - it can be async
      await fn(ctx, () => dispatch(i + 1));
    }

    await dispatch(0);
  };
}

// Usage
// const app = asyncCompose([
//   async (ctx, next) => {
//     console.log("1. Before");
//     await next();
//     console.log("1. After");
//   },
//   async (ctx, next) => {
//     console.log("2. Async work");
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     ctx.data = "fetched";
//     await next();
//   },
//   (ctx) => {
//     console.log("3. Final handler:", ctx.data);
//   },
// ]);

// app({}).then(() => console.log("Done"));
