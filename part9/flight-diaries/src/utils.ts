import { Visibility, Weather } from "./types.js";
import type { NewDiaryEntry } from "./types.js";
import { z } from "zod";

const NewEntrySchema = z.object({
  weather: z.enum(Weather),
  visibility: z.enum(Visibility),
  date: z.iso.date(),
  comment: z.string().optional(),
});

export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseComment = (comment: unknown): string => {
  return z.string().parse(comment);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("incorrect or missing date: " + date);
  }
  return date;
};

const isWeather = (param: string): param is Weather => {
  return (Object.values(Weather) as string[]).includes(param);
};

const parseWeather = (weather: unknown): Weather => {
  if (!weather || !isString(weather) || !isWeather(weather)) {
    throw new Error("incorrect or missing weather: " + weather);
  }
  return weather;
};

const isVisibility = (param: string): param is Visibility => {
  return (Object.values(Visibility) as string[]).includes(param);
};

const parseVisibility = (visibility: unknown): Visibility => {
  if (!visibility || !isString(visibility) || !isVisibility(visibility)) {
    throw new Error("incorrect or missing visibility: " + visibility);
  }
  return visibility;
};
