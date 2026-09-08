// Order Confirmation
type OrderCallback = () => void;


const placeOrder = (item: string, callback: OrderCallback): void => {
    console.log(`Order placed for ${item}`);
    callback();
};


placeOrder("Coffee", () => {
    console.log("Thanks for your order!");
});


// Sum with a Named Type

type SumCallback = (result: number) => void;


const sumNumbers = (a: number, b: number, callback: SumCallback): void => {
    callback(a + b);
};


sumNumbers(1, 2, (result) => {
    console.log(result);
});


// Callback with Multiple Parameters


type CompareCallback = (result: string) => void;

const compareNumbers = (a: number, b: number, callback: CompareCallback): void => {
    let result: string;
    if (a > b) {
        result = "a is bigger";
    } else if (b > a) {
        result = "b is bigger";
    } else {
        result = "equal";
    }
    callback(result);
};

compareNumbers(10, 5, (result) => {
    console.log(result);
});

compareNumbers(5, 5, (result) => {
    console.log(result);
});
