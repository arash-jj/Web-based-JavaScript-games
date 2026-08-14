function myNew(Constructor, ...args) {
  // Step 1 & 2: Create a new oject that inherits from Constructor.prototype
  const obj = Object.create(Constructor.prototype);
  // Step 3: Execute the constructor with `this` = obj
  const result = Constructor.apply(obj, args);
  // Step 4: If the constructor returns an object, return that; otherwise return obj
  return result && typeof result === "object" ? result : obj;
}

function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return `Hi ${this.name}`;
};

const p = myNew(Person, 'Alice');
console.log(p.sayHi()) // Output: "Hi Alice"
