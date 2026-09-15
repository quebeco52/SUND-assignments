import express, { Request, Response } from "express";

const app = express();

const PORT = 3000;

type Catalog = {
    publisher: string;
    categories: {
        grandStrategy: string[];
        management: string[];
        classics: string[];
        expansions: string[];
    };
    lastUpdated: string;
};

type About = {
    title: string;
    description: string;
    founded: number;
    funFact: string;
};



//skill 1
// code 200
app.get("/", (req: Request, res: Response): void => {
    res.send("Welcome to the games");
});

//skill 2
// code 200

app.get("/catalog", (req: Request, res: Response): void => {
    const catalog: Catalog = {
        publisher: "Paradox Interactive",
        categories: {
            grandStrategy: ["Crusader Kings III", "Europa Universalis IV", "Hearts of Iron IV", "Europa Universalis V"],
            management: ["Cities: Skylines II", "Prison Architect"],
            classics: ["Europa Universalis II", "Victoria II", "Crusader Kings II"],
            expansions: ["Royal Court", "Leviathan", "By Blood Alone", "Nemesis"]
        },
        lastUpdated: new Date().toISOString().split("T")[0]
    };

    res.json(catalog);
});

//skill 4
// code 200
app.get("/about", (req: Request, res: Response): void => {
    const about: About = {
        title: "Paradox Interactive",
        description: "A Swedish studio and publisher.",
        founded: 1999,
        funFact: "A Europa Universalis V game can take more then 100 hours to complete"
    };

    res.json(about);
});

//skill 5
// code 200

app.get("/support", (req: Request, res: Response): void => {
    res.send("Patch notes are posted on Wednesdays.");
});

//skill 6

app.listen(PORT, (): void => {
    console.log(`http://localhost:${PORT}`);
});
