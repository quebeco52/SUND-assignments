
enum Color {
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
}


const showColor = (color: Color): string => {
  return `You chose ${color}`;
};


console.log(showColor(Color.Red));
console.log(showColor(Color.Green));
console.log(showColor(Color.Blue));

enum PizzaSize {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}


const orderPizza = (size: PizzaSize): string => {
  return `You ordered a ${size} pizza.`;
};
console.log(orderPizza(PizzaSize.Small));
console.log(orderPizza(PizzaSize.Medium));
console.log(orderPizza(PizzaSize.Large));

enum Role {
  Admin = "Admin",
  User = "User",
  Guest = "Guest",
}


const printRole = (role: Role): string => {
  switch (role) {
    case Role.Admin:
      return "You have full access";
    case Role.User:
      return "You have limited access";
    case Role.Guest:
      return "You have guest access";
  }
};


console.log(printRole(Role.Admin));
console.log(printRole(Role.User));
console.log(printRole(Role.Guest));
