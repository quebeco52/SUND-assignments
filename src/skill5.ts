// A Different Advice Slip

type AdviceSlipType = {
    slip: {
        id: number;
        advice: string;
    };
};

const fetchAdviceAndLog = (id: number): void => {
    fetch(`https://api.adviceslip.com/advice/${id}`)
        .then((response: Response) => response.json())
        .then((data: AdviceSlipType) => {
            console.log(`ID ${data.slip.id}: ${data.slip.advice}`);
        });
};

fetchAdviceAndLog(10);
fetchAdviceAndLog(42);
fetchAdviceAndLog(100);
