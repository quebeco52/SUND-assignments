// Temperature Converter

type ConvertCallback = (celsius: number) => number;

const convertTemperature = (celsius: number, callback: ConvertCallback): number => {
    return callback(celsius);
};

const fahrenheit = convertTemperature(25, (celsius) => (celsius * 1.8) + 32);
const kelvin = convertTemperature(25, (celsius) => celsius + 273.15);

console.log(fahrenheit);
console.log(kelvin);


// Array Processor with a Return Value

type ReduceCallback = (accumulator: number, current: number) => number;

const processNumbers = (arr: number[], callback: ReduceCallback): number => {

    let total = arr[0];
    for (let i = 1; i < arr.length; i++) {
        total = callback(total, arr[i]);
    }
    return total;
};

const numbers = [2, 4, 6, 8, 10];
const add = (a: number, b: number) => a + b;
const sum = processNumbers(numbers, add);

console.log(sum);
