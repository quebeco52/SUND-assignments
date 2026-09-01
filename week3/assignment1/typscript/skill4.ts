
const wrapInArray = <T>(item: T): T[] => {
  return [item];
};


console.log(wrapInArray("cat"));
console.log(wrapInArray(42));
const firstItem = <T>(items: T[]): T | undefined => {
  return items[0];
};


console.log(firstItem([1, 2, 3]));
console.log(firstItem(["a", "b", "c"]));
const swap = <T>(first: T, second: T): [T, T] => {
  return [second, first];
};


console.log(swap("hello", "world"));
console.log(swap(10, 20));
