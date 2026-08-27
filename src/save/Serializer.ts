export class Serializer {
  public static serialize<T>(data: T): string {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json)); // Base64 encoding
  }

  public static deserialize<T>(encoded: string): T | null {
    try {
      const json = decodeURIComponent(atob(encoded));
      return JSON.parse(json) as T;
    } catch (e) {
      console.error('Failed to deserialize save state:', e);
      return null;
    }
  }
}
