import express, { Request, Response } from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = 3000;

// Skill 1
app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

// Skill 2
const randomPersonSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    })
  ).nonempty(),
});

app.get("/random-person", async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from RandomUser API" });
    }

    const data = await response.json();
    const result = randomPersonSchema.safeParse(data);

    if (!result.success) {
      return res.status(500).json({
        error: "Validation failed on external API data",
        details: result.error.issues,
      });
    }

    const person = result.data.results[0];
    res.json({
      fullName: `${person.name.first} ${person.name.last}`,
      country: person.location.country,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random person" });
  }
});

// Skill 3
const userSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).default(28),
  email: z.string().email().toLowerCase(),
});

app.post("/users", (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues,
    });
  }

  res.status(201).json(result.data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
