type helloFunction = (message: string) => void;

const hello = (callback: helloFunction): void => {
    callback("Hello from callback!");
};

const handleHello = (message: string): void => {
    console.log(message);
};
hello(handleHello);