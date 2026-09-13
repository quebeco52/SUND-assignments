const fetchTwoAdvice = async (id1: number, id2: number): Promise<void> => {
    try {
        const response1 = await fetch(`https://api.adviceslip.com/advice/${id1}`);
        const data1 = await response1.json();
        console.log(`Advice ID: ${id1}: ${data1.slip.advice}`);

        const response2 = await fetch(`https://api.adviceslip.com/advice/${id2}`);
        const data2 = await response2.json();
        console.log(`Advice ID: ${id2}: ${data2.slip.advice}`);
    } catch (error) {
        console.log("Error fetching advice:", error);
    }
};

fetchTwoAdvice(1, 2);
