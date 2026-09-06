type greetingFunction = (message: string) => void;

const sayHelloLater = (callback: greetingFunction): void => {
    setTimeout(() => {
        callback("Hi, I am late!")
    }, 2000);
}

const handleGreeting = (message: string): void => {
    console.log(message);
}



sayHelloLater(handleGreeting);
