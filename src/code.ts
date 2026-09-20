import express, { Request, Response } from "express";

const app = express();
app.use(express.json());


const PORT = 3000;

type Party = {
    id: number;
    name: string;
    leader: string;
    seats: number;
};
type PartyParams = {
    id: string;
};
let parties: Party[] = [
    { id: 1, name: "Socialdemokraterna", leader: "Example Name", seats: 107 },
    { id: 2, name: "Moderaterna", leader: "Example Name", seats: 68 },
];


// Task 1
app.get("/parties", (req: Request, res: Response): void => {
    res.json(parties);
});


app.post("/parties", (req: Request, res: Response): void => {
    const { name, leader, seats } = req.body;

    // Task 6
    if (!name || !leader) {
        res.status(400).json({ message: "Name and leader are required." });
        return;
    }

    // Task 2
    const newParty: Party = {
        id: parties.length + 1,
        name,
        leader,
        seats: Number(seats) || 0
    };

    parties.push(newParty);
    res.status(201).json({ message: "Party created", party: newParty });
});

// Task 4
app.put("/parties/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const party = parties.find((p) => p.id === id);

    if (!party) {
        res.status(404).json({ message: `Party with id ${id} not found.` });
        return;
    }

    const { name, leader, seats } = req.body;
    if (name) party.name = name;
    if (leader) party.leader = leader;
    if (seats !== undefined) party.seats = Number(seats);

    res.json(party);
});

// Task 5
app.delete("/parties/:id", (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const partyExists = parties.some((p) => p.id === id);

    if (!partyExists) {
        res.status(404).json({ message: `Party with id ${id} not found.` });
        return;
    }

    parties = parties.filter((p) => p.id !== id);
    res.json({ message: `Party with id ${id} removed successfully.` });
});

app.listen(PORT, (): void => {
    console.log(`Server running at http://localhost:${PORT}`);
});
