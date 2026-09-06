type math = (result: number) => void;

const addNumbers = (a: number, b: number, callback: math): void => {
    const sum = a + b;
    callback(sum);
};


const handleResult = (result: number): void => {
    console.log(result);
};

addNumbers(5, 7, handleResult);
