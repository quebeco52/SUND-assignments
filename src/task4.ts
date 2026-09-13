const fetchAdvice = async (): Promise<void> => {
    try {
        const response = await fetch("https://api.adviceslip.com/advice");
        if (!response.ok) {
            throw new Error("Failed to fetch advice");
        }
        const data = await response.json();
        console.log(data.slip.advice);
    } catch (error) {
        console.error(error);
    }
};

fetchAdvice();