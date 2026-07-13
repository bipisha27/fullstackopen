import express, { type Response } from "express";
import type { NonSensitiveDiaryEntry } from "../types.ts";
import diaryService from "../services/diaryService.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.post("/", (_req, res) => {
  res.send("saving a diary ...");
});

export default router;
