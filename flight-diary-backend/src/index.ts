// src/index.ts:

import express from "express";
import cors from "cors"; // Import cors for CORS
const app = express();
app.use(cors()); // Use cors before importing our routes
import diaryRouter from "./routes/diaries";
app.use(express.json());

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
