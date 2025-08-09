import { SQLDatabase } from "encore.dev/storage/sqldb";

export const doctorDB = new SQLDatabase("doctor", {
  migrations: "./migrations",
});
