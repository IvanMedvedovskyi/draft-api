import { parse } from "csv-parse/sync";

export async function parseCSV(buffer) {
  return parse(buffer.toString(), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}
