import { texts } from '../texts';
import { validateLevel, type ValidationResult } from './validate';

/** Reads the text of a level file and checks it. Works without network (testable). */
export function parseLevel(text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: [texts.invalidJson(e instanceof Error ? e.message : String(e))] };
  }
  return validateLevel(raw);
}

/** Fetches a level file and checks it. Network and HTTP errors also become `errors`. */
export async function loadLevel(url: string): Promise<ValidationResult> {
  let text: string;
  try {
    // no-store: after editing the file, the browser must not show the old version.
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return { ok: false, errors: [texts.fileNotFound(response.status)] };
    text = await response.text();
  } catch (e) {
    return { ok: false, errors: [texts.networkError(e instanceof Error ? e.message : String(e))] };
  }
  return parseLevel(text);
}
