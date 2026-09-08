// Your Own Promise

const inStock = true;

const checkStock = new Promise<string>((resolve, reject) => {
    console.log("Checking stock...");

    if (inStock) {
        resolve("Item is in stock");
    } else {
        reject("Item is out of stock");
    }
});

console.log("Promise created.");

checkStock
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error(error);
    });



// Tracing Execution Order

const myPromise = new Promise<string>((resolve, reject) => {
    const success = true;
    if (success) {
        resolve("Inside .then(): Promise resolved successfully!");
    } else {
        reject("Inside .catch(): Promise was rejected!");
    }
});

myPromise
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });

console.log("Synchronous log: Right after .then().catch() chain");
