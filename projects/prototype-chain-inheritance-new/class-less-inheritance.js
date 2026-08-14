// Base "class"
function Animal(type) {
  this.type = type;
  this.alive = true;
}

Animal.prototype.breathe = function () {
  console.log(`${this.type} is breathing`);
};

// "Child" Class: Mammal
function Mammal(type, furColor) {
  // Call the parent constructor manually (like super())
  Animal.call(this, type);
  this.furColor = furColor;
}
// Link prototypes: Mammal inherits from Animal
Mammal.prototype = Object.create(Animal.prototype);
// Fix the constructor pointer (important for instanceof to work correctly)
Mammal.prototype.constructor = Mammal;
// Add a new method to Mammal
Mammal.prototype.nurse = function () {
  console.log(`${this.type} is nursing`);
};

// "Grandchild": Dog
function Dog(name, furColor) {
  Mammal.call(this, "Dog", furColor);
  this.name = name;
}
Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () {
  console.log(`${this.name} says Woof!`);
};

// Test the chain
const fido = new Dog("Fido", "Brown");
fido.breathe(); // "Dog is breathing" (inherited from Animal)
fido.nurse(); // "Dog is nursing"   (inherited from Mammal)
fido.bark(); // "Fido says Woof!"  (its own)
