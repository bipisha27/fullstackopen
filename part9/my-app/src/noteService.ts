import axios from "axios";
import type { Note, NewNote } from "./types.ts";

const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
  return axios.get<Note[]>(baseUrl).then((response) => response.data);
};

const create = (object: NewNote) => {
  return axios.post<Note>(baseUrl, object).then((response) => response.data);
};

export default { getAll, create };
