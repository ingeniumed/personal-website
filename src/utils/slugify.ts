import slug from "slug";

export function slugifyStr(str: string): string {
  return slug(str);
}
