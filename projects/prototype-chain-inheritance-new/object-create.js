if (!Object.create) {
  Object.create = function (proto, propertiesObject) {
    // Edge case: proto must be null or an object
    if (typeof proto !== "object" && typeof proto !== "function") {
      throw new TypeError("Oject prototype amn only be an Object or null");
    }
    // Create a temporary constructor function
    function F() {}
    // Set its prototype to the target proto
    F.prototype = proto;
    // Return a new instance of F
    const obj = new F();
    // If propertiesObject is provided, define them (skip for brevity, but real polyfill does this)
    if (propertiesObject !== undefined) {
      Object.defineProperties(obj, propertiesObject);
    }
    return obj;
  };;
}
