const flipCoin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outcome = Math.random() > 0.5;
    outcome ? resolve("You win!") : reject("You lose!");
  });
};

const playCoinFlip = async (): Promise<void> => {
  try {
    const result = await flipCoin();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

playCoinFlip();
