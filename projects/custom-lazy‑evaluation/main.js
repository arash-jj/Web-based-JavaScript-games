// Range: Lazy number generator
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// Map: Transform each value lazily
function* map(iterable, transformFn) {
  for (const value of iterable) {
    yield transformFn(value);
  }
}

// Filter: Skip values lazily
function* filter(iterable, predicateFn) {
  for (const value of iterable) {
    if (predicateFn(value)) {
      yield value;
    }
  }
}

// Take: Only yield first N values
function* take(iterable, n) {
  let count = 0;
  for (const value of iterable) {
    if (count++ >= n) break;
    yield value;
  }
}

// Utility: Convert generator to array (forces evaluation)
function toArray(iterable) {
  return [...iterable];
}

//! ---EXAMPLES---
console.log("\n Usage: \n");

// Usage: Lazy pipeline
const numbers = range(1, 100); // No computation yet
const evenNumbers = filter(numbers, (n) => n % 2 === 0); // Still no computation
const doubled = map(evenNumbers, (n) => n * 2); // Still nothing!
const result = take(doubled, 5); // Still nothing!

console.log(toArray(result)); // [4, 8, 12, 16, 20]
// Only 5 values were processed, not all 100!

/**
 * Generators can produce infinite sequences because they compute values on-demand.
 */
// function* fibonacci() {
//   let a = 0, b = 1;
//   while (true) { // Infinite loop - but it's fine!
//     yield a;
//     [a, b] = [b, a + b];
//   }
// }
// Take the first 10 Fibonacci numbers
// const fib = fibonacci();
// console.log(toArray(take(fib, 10))); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// This works because we never compute the 11th number!

//! ---TEST---
console.log("\n 🚀 Performance Test\n" + "─".repeat(40));

// Test 1: Array Approach
console.time("Array Approach");
const arr = Array.from({ length: 1000000 }, (_, i) => i);
const filtered = arr.filter((x) => x % 2 === 0);
const mapped = filtered.map((x) => x * 2);
const resultArr = mapped.slice(0, 10);
console.timeEnd("Array Approach");

// Test 2: Generator Approach
console.time("Generator Approach");
const genResult = toArray(
  take(
    map(
      filter(range(0, 999999), (x) => x % 2 === 0),
      (x) => x * 2,
    ),
    10,
  ),
);
console.timeEnd("Generator Approach");

// Visual comparison
console.log("\n📊 Visual Comparison:");
console.log("─".repeat(40));

// Run multiple times for average
const runs = 5;
let arrayTotal = 0;
let genTotal = 0;

for (let i = 0; i < runs; i++) {
  // Array
  const s1 = performance.now();
  const a = Array.from({ length: 1000000 }, (_, i) => i);
  a.filter((x) => x % 2 === 0)
    .map((x) => x * 2)
    .slice(0, 10);
  arrayTotal += performance.now() - s1;

  // Generator
  const s2 = performance.now();
  toArray(
    take(
      map(
        filter(range(0, 999999), (x) => x % 2 === 0),
        (x) => x * 2,
      ),
      10,
    ),
  );
  genTotal += performance.now() - s2;
}

const arrayAvg = arrayTotal / runs;
const genAvg = genTotal / runs;

// Create simple bar chart
const maxVal = Math.max(arrayAvg, genAvg);
const arrayBars = "█".repeat(Math.round((arrayAvg / maxVal) * 30));
const genBars = "█".repeat(Math.round((genAvg / maxVal) * 30));

console.log(`\n📈 Average of ${runs} runs:`);
console.log(`Array:     ${arrayBars} ${arrayAvg.toFixed(2)}ms`);
console.log(`Generator: ${genBars} ${genAvg.toFixed(2)}ms`);
console.log(`\n⚡ Generators are ${(arrayAvg / genAvg).toFixed(1)}x faster!`);
console.log(
  `💡 Arrays processed 1M items, generators only processed ~20 items`,
);
// The generator never processes items beyond the first 10 that pass the filter!
