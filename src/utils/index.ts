import z from "zod";

export const convexId = (table: string) =>
  z
    .string()
    .regex(new RegExp(`^${table}_[a-zA-Z0-9]+$`), `Invalid ${table} ID`);
