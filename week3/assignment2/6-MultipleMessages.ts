type messageCallback = (message: string) => void;

const sendMessage = (callback: messageCallback): void => {
    callback("First message");
    callback("Second message");
    callback("Third message");
};

const handleMessage = (message: string): void => {
    console.log(message);
};


sendMessage(handleMessage);

