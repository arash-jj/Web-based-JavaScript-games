function myInstanceOf(obj, Constructor) {
  // Edge case: Primitives or null/undefined
  if (obj === null || typeof obj !== "object") return false;

  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
  }
  return false;
}

// Test
function Vehicle() {}
const car = new Vehicle();
console.log(myInstanceOf(car, Vehicle)); // true
console.log(myInstanceOf(car, Object)); // true (because Object is above Vehicle)
console.log(myInstanceOf(5, Number)); // false (primitive)
