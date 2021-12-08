import axios from "axios";

export function ensureURLExistsAsync(url: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(() => resolve(true))
      .catch(() => reject(false));
  });
}
