import type { UserData } from '../models/definitions/User.js';
import type { PasswordData } from '../models/definitions/Password.js';

function escapeCsvValue(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(d: Date | null): string {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString();
}

/**
 * Builds a CSV string with User and Password database records for export.
 * `encryptionSeed` is omitted: it is server-managed material, not user-supplied
 * portable data, and including it would widen impact if the export file leaks.
 */
export function userAndPasswordsToCsv(user: UserData, passwords: PasswordData[]): string {
  const lines: string[] = [];

  const userHeader = [
    'type',
    'id',
    'cognitoSub',
    'name',
    'email',
    'lastLoginAt',
    'createdAt',
    'updatedAt',
  ].join(',');
  const userRow = [
    'user',
    escapeCsvValue(user.id),
    escapeCsvValue(user.cognitoSub),
    escapeCsvValue(user.name),
    escapeCsvValue(user.email),
    escapeCsvValue(formatDate(user.lastLoginAt)),
    escapeCsvValue(formatDate(user.createdAt)),
    escapeCsvValue(formatDate(user.updatedAt)),
  ].join(',');
  lines.push(userHeader);
  lines.push(userRow);

  if (passwords.length > 0) {
    lines.push('');
    const passwordHeader = [
      'type',
      'id',
      'userId',
      'title',
      'username',
      'password',
      'website',
      'notes',
      'category',
      'createdAt',
      'updatedAt',
    ].join(',');
    lines.push(passwordHeader);
    for (const p of passwords) {
      const passwordRow = [
        'password',
        escapeCsvValue(p.id),
        escapeCsvValue(p.userId),
        escapeCsvValue(p.title),
        escapeCsvValue(p.username),
        escapeCsvValue(p.password),
        escapeCsvValue(p.website),
        escapeCsvValue(p.notes),
        escapeCsvValue(p.category),
        escapeCsvValue(formatDate(p.createdAt)),
        escapeCsvValue(formatDate(p.updatedAt)),
      ].join(',');
      lines.push(passwordRow);
    }
  }

  return lines.join('\n');
}
