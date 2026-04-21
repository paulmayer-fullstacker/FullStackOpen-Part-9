// src/roues/diaries.ts:

import express from "express";

import diaryService from "../services/diaryService";

import toNewDiaryEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  // // Use getNonSensitiveEntries() to return an array of objects where the comment field has been stripped out.
  // res.send(diaryService.getNonSensitiveEntries());
  // Use getEntries() to return the whole DiaryEntry[] array (including comments).
  res.send(diaryService.getEntries());
});

router.get("/:id", (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
