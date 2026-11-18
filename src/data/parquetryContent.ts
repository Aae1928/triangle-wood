export interface ParquetryEntry {
  name: string;
  classKey: string;
  fields: { label: string; value: string }[];
  headline: string;
  tagline: string;
  description: string;
}

export const parquetryEntries: ParquetryEntry[] = [];

export const replaceParquetryEntries = (entries: ParquetryEntry[]): void => {
  parquetryEntries.splice(0, parquetryEntries.length, ...entries);
};
