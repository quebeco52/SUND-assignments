type orderStatusFunction = (status: string) => void;

const orderPizza = (callback: orderStatusFunction): void => {
    setTimeout(() => {
        callback("Your pizza is ready!");
    }, 3000);
};


const handleOrderStatus = (status: string): void => {
    console.log(status);
};



orderPizza(handleOrderStatus);
