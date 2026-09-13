const delayedMessage = (message: string, delay: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(message);
        }, delay);
    });
};

const run = async (): Promise<void> => {
    try {
        const result = await delayedMessage("Hello", 1000);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

run();