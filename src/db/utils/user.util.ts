/**
 * Escapes unicode characters from the provided raw string value.
 *
 * @param value The raw string value.
 * @returns The escaped string.
 */
function escapePostgresString(value: string) {
  return `E'${value.replace(/(\\)/g, `\\\\`).replace(/(')/g, `\\'`)}'`;
}

export function generateSalt(inputToHash: string, saltType: string): () => string {
  return () => `crypt(${escapePostgresString(inputToHash)}, gen_salt(${saltType}))`;
}
