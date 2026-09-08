// Countdown Timer


const countdown = (seconds: number, callback: () => void): void => {
    setTimeout(() => {
        console.log("Time's up!");
        callback();
    }, seconds * 1000);
};


console.log("Before countdown");
countdown(3, () => {
    console.log("Countdown finished.");
});
console.log("After countdown");


// Delayed Greeting

const delayedGreeting = (name: string, delay: number, callback: () => void): void => {
    setTimeout(() => {
        console.log(`Hi ${name}, thanks for waiting!`);
        callback();
    }, delay);
};

delayedGreeting("Alice", 1500, () => {
    console.log("Callback executed!");
});