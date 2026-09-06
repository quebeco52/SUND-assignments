type uppercase = (result: string) => void;

const toUppercase = (text: string, callback: uppercase): void => {
    const upper = text.toUpperCase();
    callback(upper);
};


const handleUppercase = (result: string): void => {
    console.log(result);
};


toUppercase("hello world", handleUppercase);
