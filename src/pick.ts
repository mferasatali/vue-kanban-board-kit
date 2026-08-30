import { MissingKeysError } from './types'

export function missingKeys(
  payload: object | null | undefined,
  keys: readonly string[]
): string[] {
  if (!payload || typeof payload !== 'object') return [...keys]
  const record = payload as Record<string, unknown>
  return keys.filter((key) => {
    const value = record[key]
    if (value === undefined || value === null) return true
    if (typeof value === 'string' && value.trim() === '') return true
    return false
  })
}

export function assertRequired<T extends object>(
  kind: string,
  payload: T | null | undefined,
  keys: readonly string[]
): T {
  const missing = missingKeys(payload, keys)
  if (missing.length) throw new MissingKeysError(kind, missing)
  return payload as T
}

export function pickRequired<T extends object, K extends keyof T>(
  payload: T,
  keys: readonly K[]
): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const key of keys) out[key] = payload[key]
  return out
}

export function hasRequired(
  payload: object | null | undefined,
  keys: readonly string[]
): boolean {
  return missingKeys(payload, keys).length === 0
}
