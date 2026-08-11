Function.prototype.myCall = function(thisArg, ...args) {
  // 1. If thisArgs in null/undefined, set to global oject (or globalThis)
  const context = thisArg ?? globalThis; // works in Node/browser

  // 2. Ensure context in an object (wrap primitive)
  const wrappedContext = Object(context);

  // 3. Use a unique symbol to avoid property collisions
  const uniqueKey = Symbol('fn');
  wrappedContext[uniqueKey] = this // `this` is the functions being called

  // 4. Execute the functions with given args
  const result = wrappedContext[uniqueKey](...args);

  // 5. Clean up
  delete wrappedContext[uniqueKey];

  return result;
}

// Tests
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'John' };
console.log("\n ---myCall tests--- \n")
console.log(greet.myCall(person, 'Hello', '!')); // "Hello, John!"
console.log(greet.myCall(null, 'Hi', '?')); // "Hi, [global name]?" (global might have name)


Function.prototype.myApply = function(thisArgs, argsArray) {
  const context = thisArgs ?? globalThis;
  const wrappedContext = Object(context);
  const uniqueKey = Symbol('fn');
  wrappedContext[uniqueKey] = this;

  // Handle cases where argsArray is null/undefined - treat as empty array
  const args = argsArray ? [...argsArray] : [];
  const result = wrappedContext[uniqueKey](...args);

  delete wrappedContext[uniqueKey];
  return result
}


// Test
console.log("\n ---myApply tests--- \n")
console.log(greet.myApply(person, ['Howdy', '!!!'])); // "Howdy, John!!!"
console.log(greet.myApply(null, ['Hey', '.'])); // works


Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this; // the function we are binding
  
  // Return a new function
  function boundFn(...callArgs) {
    // If this function is called as a constructor (new.target exists),
    // we should not bind `thisArg`; we use the instance itself.
    // But we still need to merge arguments.
    const isConstructorCall = new.target !== undefined;
    const ctx = isConstructorCall ? this : (thisArg ?? globalThis);
    
    // Merge bound arguments and call arguments
    const allArgs = [...boundArgs, ...callArgs];
    return fn.apply(ctx, allArgs);
  }
  
  // Preserve the original prototype if needed (for constructors)
  // But for simplicity, we'll just return a function.
  // We can also set the prototype to the original's prototype to support `new`.
  boundFn.prototype = Object.create(fn.prototype);
  
  return boundFn;
};

// Tests
console.log("\n ---myBind tests--- \n");
function multiply(a, b, c) {
  return a * b * c * (this.factor || 1);
}

const context = { factor: 2 };
const bound = multiply.myBind(context, 2, 3);
console.log(bound(4)); // 2*3*4*2 = 48

// Edge case: using `new` with bound function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const BoundPerson = Person.myBind(null, 'Alice');
const alice = new BoundPerson(25);
console.log(alice); // Person { name: 'Alice', age: 25 } – `this` is the new instance, not null