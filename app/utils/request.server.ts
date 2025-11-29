import { json } from "react-router";

export const badRequest = <T>(data: T) =>
  json<T>(data, { status: 400 });