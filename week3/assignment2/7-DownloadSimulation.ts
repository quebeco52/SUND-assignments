type downloadFunction = (data: string) => void;

const downloadData = (url: string, callback: downloadFunction): void => {
    setTimeout(() => {
        callback(`Downloaded data from ${url}`);
    }, 2000);
};

const handleDownload = (data: string): void => {
    console.log(data);
};



downloadData("https://example.com", handleDownload);