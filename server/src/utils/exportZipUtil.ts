import { strToU8, zipSync } from 'fflate/browser';

/**
 * Creates a ZIP buffer containing user-data.csv.
 */
export function createUserExportZip(csv: string): Buffer {
  const zipped = zipSync({ 'user-data.csv': strToU8(csv) }, { level: 6 });
  return Buffer.from(zipped);
}
