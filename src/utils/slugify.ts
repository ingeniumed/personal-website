import slug from "slug";

export function slugifyStr(str: string): string {
  return slug(str);
}

export function slugifyAll(arr: string[]): string[] {
  return arr.map(str => slugifyStr(str));
}
