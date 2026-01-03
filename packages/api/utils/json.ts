export function safeParseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseJsonArray(value: string): string[] {
  const parsed = safeParseJson<unknown>(value, []);
  return Array.isArray(parsed) ? (parsed as string[]) : [];
}

export function parseJsonObject(
  value: string,
): Record<string, unknown> | null {
  return safeParseJson<Record<string, unknown> | null>(value, null);
}

export function serializeJson(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
