export function pick<T extends object, K extends keyof any>(
  obj: T,
  names: K[],
): any {
  for (const n of names as any[]) {
    const f = (obj as any)[n];
    if (typeof f === 'function') return f.bind(obj);
  }
  throw new Error('None of methods found: ' + (names as any[]).join(', '));
}
