const myPromise = new Promise<string>((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Resolved operation successfully!");
  } else {
    reject("Resolved operation rejected!");
  }
});

const consumePromise = async (): Promise<void> => {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

consumePromise();
